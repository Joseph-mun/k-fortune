import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function NavBar() {
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <nav className="w-full max-w-5xl flex items-center justify-between py-4">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg font-semibold text-text-primary tracking-tight font-[family-name:var(--font-heading)]">
            K-Destiny
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/pricing"
            className="px-3 py-1.5 text-sm text-text-muted hover:text-text-primary transition-colors rounded-md hover:bg-white/5"
          >
            {tNav("pricing")}
          </Link>
          <Link
            href="/compatibility"
            className="px-3 py-1.5 text-sm text-text-muted hover:text-text-primary transition-colors rounded-md hover:bg-white/5"
          >
            {tNav("compatibility")}
          </Link>
          <Link
            href="/gallery"
            className="px-3 py-1.5 text-sm text-text-muted hover:text-text-primary transition-colors rounded-md hover:bg-white/5"
          >
            {tNav("gallery")}
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <LocaleSwitcher />
      </div>
    </nav>
  );
}
