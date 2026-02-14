"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
  badge?: string;
}

interface ServiceHighlightProps {
  services: ServiceItem[];
}

export function ServiceHighlight({ services }: ServiceHighlightProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {services.map((service, i) => (
        <Link key={service.href} href={service.href as "/start" | "/star-match" | "/compatibility" | "/gallery"}>
          <TiltCard
            className={cn(
              "glass-interactive rounded-xl p-6 flex flex-col gap-3 group cursor-pointer",
              "animate-slide-up"
            )}
            tiltMax={4}
            scale={1.01}
          >
            {/* Badge */}
            {service.badge && (
              <span
                className="self-start px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase"
                style={{
                  background: `${service.color}15`,
                  color: service.color,
                  border: `1px solid ${service.color}25`,
                }}
              >
                {service.badge}
              </span>
            )}

            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: `${service.color}15`,
                border: `1px solid ${service.color}25`,
              }}
            >
              {service.icon}
            </div>

            {/* Title + Desc */}
            <div>
              <h3 className="text-base font-semibold text-text-primary mb-1">
                {service.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-1 mt-auto">
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                style={{ color: service.color }}
              />
            </div>
          </TiltCard>
        </Link>
      ))}
    </div>
  );
}
