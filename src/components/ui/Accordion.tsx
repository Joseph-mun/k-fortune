"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  title,
  icon,
  defaultOpen = false,
  children,
  className,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("rounded-lg glass", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full p-4 text-left group"
      >
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.06]">
              {icon}
            </span>
          )}
          <span className="text-sm font-semibold text-text-primary">
            {title}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-muted transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
