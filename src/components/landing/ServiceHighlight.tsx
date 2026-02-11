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
              "glass-premium rounded-xl p-5 flex flex-col gap-3 group cursor-pointer",
              "hover:border-white/[0.12] transition-all duration-300",
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
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: `${service.color}10`,
                border: `1px solid ${service.color}15`,
              }}
            >
              {service.icon}
            </div>

            {/* Title + Desc */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">
                {service.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
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
