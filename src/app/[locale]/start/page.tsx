import { useTranslations } from "next-intl";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { BirthInputForm } from "@/components/forms/BirthInputForm";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default function StartPage() {
  const t = useTranslations("start");

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full px-4">
        <NavBar />
      </div>

      <section className="relative w-full flex-1 flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.04) 50%, transparent 70%)" }} />

        <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
          {/* Back link */}
          <Link
            href="/"
            className="self-start inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {t("back")}
          </Link>

          {/* Form */}
          <div className="w-full glass rounded-xl p-6 ring-glow-purple">
            <BirthInputForm />
          </div>
        </div>
      </section>

      <div className="w-full px-4 flex justify-center">
        <Footer />
      </div>
    </main>
  );
}
