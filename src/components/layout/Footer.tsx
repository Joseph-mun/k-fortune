import { useTranslations } from "next-intl";

export function Footer() {
  const tCommon = useTranslations("common");

  return (
    <footer className="w-full max-w-5xl border-t border-white/[0.06] py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-text-muted text-xs">
          &copy; {new Date().getFullYear()} K-Destiny
        </p>
        <p className="text-text-muted text-xs max-w-md text-center sm:text-right">
          {tCommon("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
