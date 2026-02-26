import { Webhooks } from "@polar-sh/nextjs";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * POST /api/webhook/polar
 *
 * Polar Webhook handler using @polar-sh/nextjs
 * MVP: Only handles order.paid for single_reading purchases
 */

const isDev = process.env.NODE_ENV === "development";
const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

if (!webhookSecret) {
  console.warn("[Polar Webhook] POLAR_WEBHOOK_SECRET is not configured. Webhook endpoint will reject all requests.");
}

export const POST = webhookSecret
  ? Webhooks({
  webhookSecret,

  onPayload: async (payload) => {
    if (isDev) console.log("[Polar Webhook] Received event:", payload.type);
  },

  onOrderPaid: async (payload) => {
    if (isDev) console.log("[Polar Webhook] Order paid:", payload.data.id);

    try {
      const supabase = createServerClient();
      const order = payload.data;

      const customerEmail = order.customer.email;
      const orderId = order.id;
      const amount = order.totalAmount;
      const currency = order.currency;

      // Idempotency check
      const { data: existingPurchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("polar_order_id", orderId)
        .maybeSingle();

      if (existingPurchase) {
        if (isDev) console.log(`[Polar Webhook] Order ${orderId} already processed, skipping`);
        return;
      }

      const productType = String(order.metadata.product_type || "single_reading");
      const userId = order.metadata.user_id ? String(order.metadata.user_id) : null;
      const readingId = order.metadata.reading_id ? String(order.metadata.reading_id) : null;

      // Resolve auth_id → Supabase UUID
      let supabaseUserId: string | null = null;
      if (userId) {
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", userId)
          .maybeSingle();

        if (userError) {
          console.error(`[Polar Webhook] Database error resolving user_id: ${userId}`, userError);
          throw new Error(`Failed to resolve user: ${userError.message}`);
        }

        if (!user) {
          console.error(`[Polar Webhook] User not found for user_id: ${userId}`);
          throw new Error(`User not found: ${userId}`);
        }

        supabaseUserId = user.id;
      }

      console.log(`[Polar Webhook] Processing order: ${orderId}, readingId: ${readingId}, userId: ${userId}, supabaseUserId: ${supabaseUserId}`);

      // Resolve reading UUID from session_id
      let readingUuid: string | null = null;
      if (readingId) {
        const { data: reading } = await supabase
          .from("readings")
          .select("id")
          .eq("session_id", readingId)
          .maybeSingle();

        readingUuid = reading?.id || null;
      }

      // Record purchase
      const { error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          user_id: supabaseUserId,
          reading_id: readingUuid,
          polar_order_id: orderId,
          polar_customer_id: order.customer.id,
          product_type: productType,
          amount: amount,
          currency: currency,
          status: "completed",
        });

      if (purchaseError) {
        console.error("[Polar Webhook] Failed to record purchase:", purchaseError);
        throw new Error(`Failed to record purchase: ${purchaseError.message}`);
      }

      console.log(JSON.stringify({
        event: "purchase_completed",
        orderId,
        amount,
        currency,
        productType,
        customerEmail,
      }));

      // Mark reading as paid
      if (readingId) {
        const { error: readingError } = await supabase
          .from("readings")
          .update({ is_paid: true })
          .eq("session_id", readingId);

        if (readingError) {
          console.error("[Polar Webhook] Failed to update reading:", readingError);
          throw new Error(`Failed to update reading status: ${readingError.message}`);
        }
      }

      if (isDev) console.log(
        `[Polar Webhook] Order processed: ${orderId}, customer: ${customerEmail}, amount: ${amount}`
      );
    } catch (error) {
      console.error("[Polar Webhook] Error processing order:", error);
    }
  },
})
  : () =>
      NextResponse.json(
        { error: { code: "CONFIG_ERROR", message: "Webhook is not configured" } },
        { status: 503 }
      );
