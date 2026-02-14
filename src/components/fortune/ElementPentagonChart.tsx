"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Element, ElementAnalysis } from "@/lib/saju/types";
import { ELEMENT_COLORS, ELEMENT_HANJA } from "@/lib/saju/constants";
import { ElementIcon } from "@/components/icons/ElementIcon";

interface ElementPentagonChartProps {
  analysis: ElementAnalysis;
  size?: number;
  animated?: boolean;
}

const ELEMENTS_ORDER: Element[] = ["wood", "fire", "earth", "metal", "water"];
const ELEMENT_LABELS: Record<Element, string> = {
  wood: "Wood",
  fire: "Fire",
  earth: "Earth",
  metal: "Metal",
  water: "Water",
};

function getPoint(index: number, radius: number, cx: number, cy: number) {
  const angle = (index * 72 - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function toPolygon(points: { x: number; y: number }[]) {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

export function ElementPentagonChart({
  analysis,
  size = 240,
  animated = true,
}: ElementPentagonChartProps) {
  const t = useTranslations("elements");
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;

  const [values, setValues] = useState<Record<Element, number>>(
    animated
      ? { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
      : { wood: analysis.wood, fire: analysis.fire, earth: analysis.earth, metal: analysis.metal, water: analysis.water },
  );
  const [activeElement, setActiveElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!animated) {
      setValues({ wood: analysis.wood, fire: analysis.fire, earth: analysis.earth, metal: analysis.metal, water: analysis.water });
      return;
    }
    const timer = setTimeout(() => {
      setValues({ wood: analysis.wood, fire: analysis.fire, earth: analysis.earth, metal: analysis.metal, water: analysis.water });
    }, 200);
    return () => clearTimeout(timer);
  }, [analysis, animated]);

  const outerPoints = ELEMENTS_ORDER.map((_, i) => getPoint(i, maxRadius, cx, cy));
  const midPoints = ELEMENTS_ORDER.map((_, i) => getPoint(i, maxRadius * 0.5, cx, cy));
  const dataPoints = ELEMENTS_ORDER.map((el, i) => {
    const value = Math.max(values[el], 5);
    const radius = (value / 100) * maxRadius;
    return getPoint(i, radius, cx, cy);
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="max-w-full"
      >
        {/* Axis lines */}
        {outerPoints.map((p, i) => (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Outer pentagon guide */}
        <polygon
          points={toPolygon(outerPoints)}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />

        {/* 50% guide */}
        <polygon
          points={toPolygon(midPoints)}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />

        {/* Data polygon */}
        <polygon
          points={toPolygon(dataPoints)}
          fill="var(--accent-bg-tint, rgba(139,92,246,0.08))"
          stroke="var(--accent-primary, #8B5CF6)"
          strokeWidth={1.5}
          style={{ transition: "all 1s ease-out" }}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={ELEMENT_COLORS[ELEMENTS_ORDER[i]]}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={1}
            style={{ transition: "all 1s ease-out" }}
          />
        ))}

        {/* Labels */}
        {ELEMENTS_ORDER.map((el, i) => {
          const labelPoint = getPoint(i, maxRadius + 22, cx, cy);
          return (
            <g
              key={`label-${el}`}
              onMouseEnter={() => setActiveElement(el)}
              onMouseLeave={() => setActiveElement(null)}
              onTouchStart={() => setActiveElement(activeElement === el ? null : el)}
              className="cursor-pointer"
            >
              <foreignObject
                x={labelPoint.x - 9}
                y={labelPoint.y - 18}
                width={18}
                height={18}
              >
                <ElementIcon element={el} size={18} />
              </foreignObject>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 8}
                textAnchor="middle"
                fontSize={9}
                fill={activeElement === el ? ELEMENT_COLORS[el] : "rgba(255,255,255,0.5)"}
                style={{ transition: "fill 0.2s" }}
              >
                {ELEMENT_LABELS[el]} {ELEMENT_HANJA[el]}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 20}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill={ELEMENT_COLORS[el]}
                style={{ transition: "opacity 0.2s", opacity: activeElement === el ? 1 : 0.7 }}
              >
                {analysis[el]}%
              </text>
            </g>
          );
        })}

        {/* Active element description in center */}
        {activeElement && (
          <foreignObject x={cx - 65} y={cy - 12} width={130} height={24}>
            <p
              className="text-[10px] text-text-muted text-center leading-tight"
              style={{ color: ELEMENT_COLORS[activeElement] }}
            >
              {t(`${activeElement}Desc`)}
            </p>
          </foreignObject>
        )}
      </svg>
    </div>
  );
}
