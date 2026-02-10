"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: "en" | "es") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-text-muted" />
      <button
        onClick={() => handleLocaleChange("en")}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          locale === "en"
            ? "bg-purple-500/20 text-purple-300 font-semibold"
            : "text-text-muted hover:text-text-secondary"
        }`}
      >
        EN
      </button>
      <span className="text-text-muted">/</span>
      <button
        onClick={() => handleLocaleChange("es")}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          locale === "es"
            ? "bg-purple-500/20 text-purple-300 font-semibold"
            : "text-text-muted hover:text-text-secondary"
        }`}
      >
        ES
      </button>
    </div>
  );
}
