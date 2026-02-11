"use client";

import { useTranslations } from "next-intl";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  const t = useTranslations("legal.privacy");

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full px-4">
        <NavBar />
      </div>

      <article className="w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-text-primary mb-2">{t("title")}</h1>
        <p className="text-text-muted text-xs mb-8">{t("lastUpdated")}</p>

        <div className="space-y-8 text-text-secondary text-sm leading-relaxed">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("intro.heading")}</h2>
            <p>{t("intro.body")}</p>
          </section>

          {/* 2. Data We Collect */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("dataCollected.heading")}</h2>
            <p className="mb-3">{t("dataCollected.body")}</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>{t("dataCollected.items.account")}</li>
              <li>{t("dataCollected.items.birth")}</li>
              <li>{t("dataCollected.items.payment")}</li>
              <li>{t("dataCollected.items.usage")}</li>
              <li>{t("dataCollected.items.device")}</li>
            </ul>
          </section>

          {/* 3. Purpose & Legal Basis */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("purpose.heading")}</h2>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>{t("purpose.items.service")}</li>
              <li>{t("purpose.items.payment")}</li>
              <li>{t("purpose.items.improvement")}</li>
              <li>{t("purpose.items.communication")}</li>
            </ul>
          </section>

          {/* 4. Birth Data */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("birthData.heading")}</h2>
            <p>{t("birthData.body")}</p>
          </section>

          {/* 5. Third-Party Services */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("thirdParty.heading")}</h2>
            <p className="mb-3">{t("thirdParty.body")}</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>{t("thirdParty.items.supabase")}</li>
              <li>{t("thirdParty.items.polar")}</li>
              <li>{t("thirdParty.items.vercel")}</li>
              <li>{t("thirdParty.items.google")}</li>
            </ul>
          </section>

          {/* 6. International Transfer */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("transfer.heading")}</h2>
            <p>{t("transfer.body")}</p>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("retention.heading")}</h2>
            <p>{t("retention.body")}</p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("rights.heading")}</h2>
            <p className="mb-3">{t("rights.body")}</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>{t("rights.items.access")}</li>
              <li>{t("rights.items.rectification")}</li>
              <li>{t("rights.items.erasure")}</li>
              <li>{t("rights.items.portability")}</li>
              <li>{t("rights.items.objection")}</li>
              <li>{t("rights.items.withdraw")}</li>
            </ul>
          </section>

          {/* 9. Cookies */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("cookies.heading")}</h2>
            <p>{t("cookies.body")}</p>
          </section>

          {/* 10. Children */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("children.heading")}</h2>
            <p>{t("children.body")}</p>
          </section>

          {/* 11. Changes */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("changes.heading")}</h2>
            <p>{t("changes.body")}</p>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("contact.heading")}</h2>
            <p>{t("contact.body")}</p>
          </section>
        </div>
      </article>

      <div className="w-full px-4 flex justify-center">
        <Footer />
      </div>
    </main>
  );
}
