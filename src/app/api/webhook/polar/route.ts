import { Webhooks } from "@polar-sh/nextjs";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * POST /api/webhook/polar
 *
 * Polar Webhook handler using @polar-sh/nextjs
 * Receives payment events from Polar and processes them
 *
 * Design spec: Section 4.2 - POST /api/webhook/polar
 *
 * Events handled:
 * - order.paid: Record purchase, activate detailed reading
 * - subscription.created: Start subscription record
 * - subscription.updated: Update subscription status
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
    // Fallback handler for unhandled events
    isDev && console.log("[Polar Webhook] Received event:", payload.type);
  },

  onOrderPaid: async (payload) => {
    isDev && console.log("[Polar Webhook] Order paid:", payload.data.id);

    try {
      const supabase = createServerClient();
      const order = payload.data;

      // Extract customer info from order (Polar SDK types)
      const customerEmail = order.customer.email;
      const orderId = order.id;
      const amount = order.totalAmount;
      const currency = order.currency;

      // Extract and validate metadata
      const productType = String(order.metadata.product_type || "detailed_reading");
      const userId = order.metadata.user_id ? String(order.metadata.user_id) : null;
      const readingId = order.metadata.reading_id ? String(order.metadata.reading_id) : null;

      // Resolve auth_id → Supabase UUID for consistent user references
      let supabaseUserId: string | null = null;
      if (userId) {
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", userId)
          .maybeSingle();

        if (!user) {
          console.error(`[Polar Webhook] Invalid user_id in metadata: ${userId}`);
          return;
        }
        supabaseUserId = user.id;
      }

      // Resolve reading UUID from session_id
      let readingUuid: string | null = null;
      if (readingId) {
        const query = supabase
          .from("readings")
          .select("id")
          .eq("session_id", readingId);

        if (supabaseUserId) {
          query.eq("user_id", userId);
        }

        const { data: reading } = await query.maybeSingle();
        readingUuid = reading?.id || null;
      }

      // Record purchase in database
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
      } else {
        // Structured log for Vercel Logs — purchase_completed event
        console.log(JSON.stringify({
          event: "purchase_completed",
          orderId,
          amount,
          currency,
          productType,
          customerEmail,
        }));
      }

      // If there is a reading, mark it as paid
      if (readingId) {
        const { error: readingError } = await supabase
          .from("readings")
          .update({ is_paid: true })
          .eq("session_id", readingId);

        if (readingError) {
          console.error("[Polar Webhook] Failed to update reading:", readingError);
        }
      }

      isDev && console.log(
        `[Polar Webhook] Order processed: ${orderId}, customer: ${customerEmail}, amount: ${amount}`
      );
    } catch (error) {
      console.error("[Polar Webhook] Error processing order:", error);
    }
  },

  onSubscriptionCreated: async (payload) => {
    isDev && console.log("[Polar Webhook] Subscription created:", payload.data.id);

    try {
      const supabase = createServerClient();
      const subscription = payload.data;

      const userId = subscription.metadata.user_id
        ? String(subscription.metadata.user_id)
        : null;
      const plan = String(subscription.metadata.plan || "premium");

      const { error } = await supabase.from("subscriptions").insert({
        user_id: userId,
        polar_subscription_id: subscription.id,
        polar_customer_id: subscription.customerId,
        plan,
        status: "active",
        current_period_start: subscription.currentPeriodStart.toISOString(),
        current_period_end: subscription.currentPeriodEnd?.toISOString() || null,
      });

      if (error) {
        console.error(
          "[Polar Webhook] Failed to record subscription:",
          error
        );
      } else {
        isDev && console.log(
          "[Polar Webhook] Subscription recorded:",
          subscription.id
        );
      }

      // Update user_profiles to mark as premium
      if (userId) {
        await supabase
          .from("user_profiles")
          .update({
            is_premium: true,
            premium_expires_at: subscription.currentPeriodEnd?.toISOString() || null,
          })
          .eq("id", userId);
      }
    } catch (error) {
      console.error("[Polar Webhook] Error processing subscription:", error);
    }
  },

  onSubscriptionUpdated: async (payload) => {
    isDev && console.log("[Polar Webhook] Subscription updated:", payload.data.id);

    try {
      const supabase = createServerClient();
      const subscription = payload.data;

      // Map Polar subscription status to our status
      const statusMap: Record<string, string> = {
        active: "active",
        canceled: "canceled",
        past_due: "past_due",
        incomplete: "past_due",
        incomplete_expired: "expired",
        trialing: "active",
        unpaid: "past_due",
      };

      const status = statusMap[subscription.status] || subscription.status;

      const { error } = await supabase
        .from("subscriptions")
        .update({
          status,
          current_period_start: subscription.currentPeriodStart.toISOString(),
          current_period_end: subscription.currentPeriodEnd?.toISOString() || null,
        })
        .eq("polar_subscription_id", subscription.id);

      if (error) {
        console.error(
          "[Polar Webhook] Failed to update subscription:",
          error
        );
      } else {
        isDev && console.log(
          `[Polar Webhook] Subscription updated: ${subscription.id} -> ${status}`
        );
      }

      // Update premium status if subscription is no longer active
      const userId = subscription.metadata.user_id
        ? String(subscription.metadata.user_id)
        : null;

      if (userId && (status === "canceled" || status === "expired")) {
        await supabase
          .from("user_profiles")
          .update({
            is_premium: false,
            premium_expires_at: null,
          })
          .eq("id", userId);
      }
    } catch (error) {
      console.error(
        "[Polar Webhook] Error updating subscription:",
        error
      );
    }
  },
})
  : () =>
      NextResponse.json(
        { error: { code: "CONFIG_ERROR", message: "Webhook is not configured" } },
        { status: 503 }
      );
