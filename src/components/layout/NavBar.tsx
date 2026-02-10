import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function NavBar() {
  const tCommon = useTranslations("common");

  return (
    <nav className="w-full max-w-5xl flex items-center justify-between py-6">
      <Link href="/">
        <h1 className="text-xl font-bold text-gradient-gold font-[family-name:var(--font-heading)]">
          {tCommon("appName")}
        </h1>
      </Link>
      <LocaleSwitcher />
    </nav>
  );
}
