import { useTranslations } from "next-intl";

export function Footer() {
  const tCommon = useTranslations("common");

  return (
    <footer className="w-full max-w-5xl border-t border-purple-500/10 py-8 text-center">
      <p className="text-text-muted text-sm">{tCommon("disclaimer")}</p>
      <p className="text-text-muted text-xs mt-2">
        &copy; {new Date().getFullYear()} {tCommon("appName")}. All rights reserved.
      </p>
    </footer>
  );
}
