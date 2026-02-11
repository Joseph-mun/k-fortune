"use client";

import { useTranslations } from "next-intl";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfServicePage() {
  const t = useTranslations("legal.terms");

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full px-4">
        <NavBar />
      </div>

      <article className="w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-text-primary mb-2">{t("title")}</h1>
        <p className="text-text-muted text-xs mb-8">{t("lastUpdated")}</p>

        <div className="space-y-8 text-text-secondary text-sm leading-relaxed">
          {/* 1. Acceptance */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("acceptance.heading")}</h2>
            <p>{t("acceptance.body")}</p>
          </section>

          {/* 2. Service Description */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("service.heading")}</h2>
            <p>{t("service.body")}</p>
          </section>

          {/* 3. Disclaimer */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("disclaimer.heading")}</h2>
            <p>{t("disclaimer.body")}</p>
          </section>

          {/* 4. Accounts */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("accounts.heading")}</h2>
            <p>{t("accounts.body")}</p>
          </section>

          {/* 5. Payments & Refunds */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("payments.heading")}</h2>
            <p>{t("payments.body")}</p>
          </section>

          {/* 6. Intellectual Property */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("ip.heading")}</h2>
            <p>{t("ip.body")}</p>
          </section>

          {/* 7. Prohibited Use */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("prohibited.heading")}</h2>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>{t("prohibited.items.scraping")}</li>
              <li>{t("prohibited.items.reverse")}</li>
              <li>{t("prohibited.items.harmful")}</li>
              <li>{t("prohibited.items.impersonation")}</li>
            </ul>
          </section>

          {/* 8. Limitation of Liability */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("liability.heading")}</h2>
            <p>{t("liability.body")}</p>
          </section>

          {/* 9. Termination */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("termination.heading")}</h2>
            <p>{t("termination.body")}</p>
          </section>

          {/* 10. Changes */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("changes.heading")}</h2>
            <p>{t("changes.body")}</p>
          </section>

          {/* 11. Governing Law */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{t("governing.heading")}</h2>
            <p>{t("governing.body")}</p>
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
