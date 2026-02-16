"use client";

import { useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMax?: number;
  glareEnabled?: boolean;
  scale?: number;
  style?: React.CSSProperties;
}

export function TiltCard({
  children,
  className,
  tiltMax = 6,
  glareEnabled = true,
  scale = 1.02,
  style: externalStyle,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const card = cardRef.current;
      if (!card) return;

      // Respect prefers-reduced-motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * tiltMax;
      const rotateY = (x - 0.5) * tiltMax;

      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
      );
      setGlarePos({ x: x * 100, y: y * 100 });
    },
    [tiltMax, scale]
  );

  const handleLeave = useCallback(() => {
    setTransform("");
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn("tilt-card relative", className)}
      style={{
        ...externalStyle,
        transform: transform || externalStyle?.transform,
        transition: transform
          ? "transform 0.1s ease"
          : "transform 0.4s ease",
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
    >
      {children}
      {glareEnabled && transform && (
        <div
          className="tilt-glare"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          }}
        />
      )}
    </div>
  );
}
