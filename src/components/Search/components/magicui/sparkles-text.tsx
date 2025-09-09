"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SparkleType {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: {
    top: string;
    left: string;
    zIndex: number;
  };
}

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
  sparklesCount?: number;
  colors?: {
    first: string;
    second: string;
  };
}

const DEFAULT_COLOR = {
  first: "#A07CFE",
  second: "#FE8FB5",
};

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const generateSparkle = (color: string): SparkleType => {
  return {
    id: Math.random().toString(36).slice(2),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      top: random(0, 100) + "%",
      left: random(0, 100) + "%",
      zIndex: random(1, 3),
    },
  };
};

const range = (start: number, end: number, step = 1) => {
  const length = Math.floor((end - start) / step) + 1;
  return Array.from({ length }, (_, i) => start + i * step);
};

export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = DEFAULT_COLOR,
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<SparkleType[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const now = Date.now();
      const sparklesArray = range(0, sparklesCount).map(() =>
        generateSparkle(Math.random() < 0.5 ? colors.first : colors.second)
      );
      
      // Remove old sparkles
      const keepSparkles = sparkles.filter((sparkle) => now - sparkle.createdAt < 750);
      
      setSparkles([...keepSparkles, ...sparklesArray]);
    };

    const interval = setInterval(generateSparkles, 100);
    return () => clearInterval(interval);
  }, [sparklesCount, colors, sparkles]);

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute inline-block animate-sparkle-ping"
          style={{
            ...sparkle.style,
            width: sparkle.size,
            height: sparkle.size,
          }}
        >
          <svg
            className="absolute animate-sparkle"
            viewBox="0 0 68 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: sparkle.size,
              height: sparkle.size,
            }}
          >
            <path
              d="M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.8987 51.6316 34.5 68 34.5 68C34.5 68 35.6013 51.6316 43 43.5C50.3987 35.3684 68 34 68 34C68 34 50.4957 33.3697 43 25.5C35.5043 17.6303 34.5 0 34.5 0C34.5 0 33.9957 17.6303 26.5 25.5Z"
              fill={sparkle.color}
            />
          </svg>
        </span>
      ))}
      <strong className="relative inline-block font-bold">{children}</strong>
    </span>
  );
} 