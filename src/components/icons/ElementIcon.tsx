import type { Element } from "@/lib/saju/types";
import { cn } from "@/lib/utils";

interface ElementIconProps {
  element: Element;
  size?: number;
  className?: string;
}

export function ElementIcon({ element, size = 24, className }: ElementIconProps) {
  const id = `el-${element}-${Math.random().toString(36).slice(2, 6)}`;

  const icons: Record<Element, React.ReactElement> = {
    wood: (
      <svg viewBox="0 0 24 24" width={size} height={size} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>
        </defs>
        <path
          d="M12 3C9 6.5 5 10 5 14c0 3.5 3 6.5 7 7 4-.5 7-3.5 7-7 0-4-3-7.5-7-11z"
          fill={`url(#${id}-g)`}
          opacity={0.9}
        />
        <path d="M12 21V9" stroke="#16A34A" strokeWidth={1.5} strokeLinecap="round" />
        <path d="M9.5 13c1.5-1 3.5-1 5 0" stroke="#16A34A" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
      </svg>
    ),
    fire: (
      <svg viewBox="0 0 24 24" width={size} height={size} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
        </defs>
        <path
          d="M12 2c-1 4-4 6-4 10 0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-5-7-5-7s-1 3-3 3c0-2-1-4 0-6z"
          fill={`url(#${id}-g)`}
          opacity={0.9}
        />
        <ellipse cx="13" cy="15" rx="2" ry="2.5" fill="#FDE68A" opacity={0.7} />
      </svg>
    ),
    earth: (
      <svg viewBox="0 0 24 24" width={size} height={size} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <path
          d="M4 18c2-3 4-8 8-12 4 4 6 9 8 12H4z"
          fill={`url(#${id}-g)`}
          opacity={0.85}
        />
        <path
          d="M8 18c1-2 2-5 4-7 2 2 3 5 4 7"
          fill="#D97706"
          opacity={0.4}
        />
        <line x1="3" y1="18" x2="21" y2="18" stroke="#D97706" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    ),
    metal: (
      <svg viewBox="0 0 24 24" width={size} height={size} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E4E4E7" />
            <stop offset="50%" stopColor="#A1A1AA" />
            <stop offset="100%" stopColor="#E4E4E7" />
          </linearGradient>
        </defs>
        <polygon
          points="12,3 20,12 12,21 4,12"
          fill={`url(#${id}-g)`}
          opacity={0.9}
        />
        <line x1="12" y1="3" x2="12" y2="21" stroke="#fff" strokeWidth={0.5} opacity={0.4} />
        <line x1="4" y1="12" x2="20" y2="12" stroke="#fff" strokeWidth={0.5} opacity={0.3} />
      </svg>
    ),
    water: (
      <svg viewBox="0 0 24 24" width={size} height={size} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>
        <path
          d="M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0"
          stroke={`url(#${id}-g)`}
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.9}
        />
        <path
          d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"
          stroke={`url(#${id}-g)`}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.6}
        />
        <path
          d="M5 20c2-1.5 3-1.5 5 0s3 1.5 5 0 3-1.5 5 0"
          stroke={`url(#${id}-g)`}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.3}
        />
      </svg>
    ),
  };

  return icons[element] ?? null;
}
