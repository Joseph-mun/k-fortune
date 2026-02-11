import type { StemMetaphor } from "@/lib/saju/types";
import { cn } from "@/lib/utils";

interface MetaphorIconProps {
  metaphor: StemMetaphor | string;
  size?: number;
  className?: string;
}

export function MetaphorIcon({ metaphor, size = 48, className }: MetaphorIconProps) {
  const id = `mp-${metaphor}-${Math.random().toString(36).slice(2, 6)}`;
  const s = size;

  const icons: Record<string, React.ReactElement> = {
    "great-tree": (
      <svg viewBox="0 0 48 48" width={s} height={s} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g1`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id={`${id}-g2`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#7C4A1E" />
            <stop offset="100%" stopColor="#5C3310" />
          </linearGradient>
        </defs>
        <rect x="21" y="28" width="6" height="14" rx="2" fill={`url(#${id}-g2)`} />
        <ellipse cx="24" cy="20" rx="14" ry="14" fill={`url(#${id}-g1)`} opacity={0.85} />
        <ellipse cx="18" cy="17" rx="8" ry="9" fill="#22C55E" opacity={0.5} />
        <ellipse cx="30" cy="18" rx="7" ry="8" fill="#16A34A" opacity={0.4} />
        <ellipse cx="24" cy="13" rx="6" ry="6" fill="#4ADE80" opacity={0.5} />
      </svg>
    ),
    flower: (
      <svg viewBox="0 0 48 48" width={s} height={s} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9A8D4" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="24"
            cy="14"
            rx="6"
            ry="10"
            fill={`url(#${id}-g)`}
            opacity={0.8}
            transform={`rotate(${angle} 24 24)`}
          />
        ))}
        <circle cx="24" cy="24" r="5" fill="#FBBF24" />
        <circle cx="24" cy="24" r="3" fill="#FDE68A" opacity={0.8} />
      </svg>
    ),
    sun: (
      <svg viewBox="0 0 48 48" width={s} height={s} className={cn("icon-3d", className)} fill="none">
        <defs>
          <radialGradient id={`${id}-g`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
        </defs>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="24"
            y1="6"
            x2="24"
            y2="11"
            stroke="#F59E0B"
            strokeWidth={2.5}
            strokeLinecap="round"
            transform={`rotate(${angle} 24 24)`}
            opacity={0.7}
          />
        ))}
        <circle cx="24" cy="24" r="10" fill={`url(#${id}-g)`} />
        <circle cx="21" cy="22" r="3" fill="#FDE68A" opacity={0.5} />
      </svg>
    ),
    candle: (
      <svg viewBox="0 0 48 48" width={s} height={s} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g1`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
          <linearGradient id={`${id}-g2`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FAFAFA" />
            <stop offset="100%" stopColor="#D4D4D8" />
          </linearGradient>
        </defs>
        <rect x="19" y="22" width="10" height="20" rx="2" fill={`url(#${id}-g2)`} />
        <rect x="17" y="22" width="14" height="3" rx="1" fill="#A1A1AA" opacity={0.5} />
        <line x1="24" y1="22" x2="24" y2="16" stroke="#A1A1AA" strokeWidth={1.5} />
        <path d="M24 5c-2 3-4 5-4 8 0 2.5 1.8 4.5 4 4.5s4-2 4-4.5c0-3-2-5-4-8z" fill={`url(#${id}-g1)`} />
        <ellipse cx="24" cy="12" rx="1.5" ry="2" fill="#FDE68A" opacity={0.8} />
      </svg>
    ),
    mountain: (
      <svg viewBox="0 0 48 48" width={s} height={s} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g1`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#A8A29E" />
            <stop offset="100%" stopColor="#78716C" />
          </linearGradient>
          <linearGradient id={`${id}-g2`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#D6D3D1" />
            <stop offset="100%" stopColor="#A8A29E" />
          </linearGradient>
        </defs>
        <path d="M4 40L20 10l16 30H4z" fill={`url(#${id}-g1)`} opacity={0.9} />
        <path d="M24 40L38 18l8 22H24z" fill={`url(#${id}-g2)`} opacity={0.7} />
        <path d="M14 22l6-12 4 6" stroke="#fff" strokeWidth={1} opacity={0.3} fill="none" />
        <path d="M2 36c4 0 6-2 10-2s6 2 10 2 6-2 10-2 6 2 10 2" stroke="#94A3B8" strokeWidth={1} opacity={0.3} />
      </svg>
    ),
    garden: (
      <svg viewBox="0 0 48 48" width={s} height={s} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <rect x="2" y="38" width="44" height="4" rx="2" fill="#92400E" opacity={0.5} />
        <path d="M12 38c0-6-3-10-3-14 0-3 2-5 5-5s5 2 5 5c0 4-3 8-3 14" fill={`url(#${id}-g)`} opacity={0.8} />
        <path d="M24 38c0-8-4-12-4-18 0-4 2.5-6 6-6s6 2 6 6c0 6-4 10-4 18" fill="#22C55E" opacity={0.7} />
        <path d="M36 38c0-5-2-8-2-12 0-2.5 1.5-4 4-4s4 1.5 4 4c0 4-2 7-2 12" fill="#4ADE80" opacity={0.6} />
        <circle cx="14" cy="18" r="2" fill="#EC4899" opacity={0.7} />
        <circle cx="37" cy="22" r="1.5" fill="#FBBF24" opacity={0.7} />
      </svg>
    ),
    sword: (
      <svg viewBox="0 0 48 48" width={s} height={s} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#E4E4E7" />
            <stop offset="50%" stopColor="#A1A1AA" />
            <stop offset="100%" stopColor="#E4E4E7" />
          </linearGradient>
        </defs>
        <path d="M24 4L28 30H20L24 4z" fill={`url(#${id}-g)`} />
        <line x1="24" y1="5" x2="24" y2="28" stroke="#fff" strokeWidth={0.8} opacity={0.5} />
        <rect x="16" y="29" width="16" height="3" rx="1" fill="#71717A" />
        <rect x="21" y="32" width="6" height="8" rx="1.5" fill="#52525B" />
        <circle cx="24" cy="36" r="1" fill="#A1A1AA" opacity={0.6} />
      </svg>
    ),
    jewel: (
      <svg viewBox="0 0 48 48" width={s} height={s} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g1`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id={`${id}-g2`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <polygon points="24,4 40,16 36,36 12,36 8,16" fill={`url(#${id}-g1)`} opacity={0.9} />
        <polygon points="24,4 24,36 12,36 8,16" fill={`url(#${id}-g2)`} opacity={0.4} />
        <line x1="24" y1="4" x2="24" y2="36" stroke="#fff" strokeWidth={0.5} opacity={0.3} />
        <line x1="8" y1="16" x2="40" y2="16" stroke="#fff" strokeWidth={0.5} opacity={0.2} />
        <polygon points="24,4 40,16 24,16" fill="#fff" opacity={0.15} />
      </svg>
    ),
    ocean: (
      <svg viewBox="0 0 48 48" width={s} height={s} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <path
          d="M4 16c3-4 6-4 9 0s6 4 9 0 6-4 9 0 6 4 9 0"
          stroke={`url(#${id}-g)`}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.9}
        />
        <path
          d="M4 24c3-3.5 6-3.5 9 0s6 3.5 9 0 6-3.5 9 0 6 3.5 9 0"
          stroke={`url(#${id}-g)`}
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.6}
        />
        <path
          d="M6 32c3-3 5-3 8 0s5 3 8 0 5-3 8 0 5 3 8 0"
          stroke={`url(#${id}-g)`}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.35}
        />
      </svg>
    ),
    rain: (
      <svg viewBox="0 0 48 48" width={s} height={s} className={cn("icon-3d", className)} fill="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <path
          d="M10 18c0-5 3-9 7-10 1-3 4-5 7-5s6 2 7 5c4 1 7 5 7 10 0 4-3 7-7 7H17c-4 0-7-3-7-7z"
          fill="#94A3B8"
          opacity={0.5}
        />
        {[14, 20, 26, 32, 38].map((x, i) => (
          <line
            key={x}
            x1={x}
            y1={28 + (i % 2) * 2}
            x2={x - 1}
            y2={36 + (i % 2) * 2}
            stroke={`url(#${id}-g)`}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.6 + (i % 2) * 0.2}
          />
        ))}
        <path d="M12 42c2-1 3-1 5 0s3 1 5 0" stroke="#6366F1" strokeWidth={1.5} strokeLinecap="round" opacity={0.3} />
      </svg>
    ),
  };

  return icons[metaphor] ?? <span className={className}>✦</span>;
}
