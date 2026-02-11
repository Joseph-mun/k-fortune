"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const locales = [
    { code: "ko" as const, label: "KO" },
    { code: "en" as const, label: "EN" },
    { code: "es" as const, label: "ES" },
  ];

  const handleLocaleChange = (newLocale: "ko" | "en" | "es") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-text-muted" />
      {locales.map((l, i) => (
        <span key={l.code} className="flex items-center gap-2">
          {i > 0 && <span className="text-text-muted">/</span>}
          <button
            onClick={() => handleLocaleChange(l.code)}
            className={`px-2 py-1 text-sm rounded transition-colors ${
              locale === l.code
                ? "bg-purple-500/20 text-purple-300 font-semibold"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
