import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children: React.ReactNode;
}

export function ShimmerButton({
  shimmerColor = "#ffffff",
  shimmerSize = "0.1em",
  borderRadius = "0.5rem",
  shimmerDuration = "2s",
  background = "rgba(0, 0, 0, 0.3)",
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md bg-black/40 px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        className
      )}
      style={{
        borderRadius,
        background,
      }}
      {...props}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius,
          mask: "radial-gradient(white, transparent)",
          WebkitMask: "radial-gradient(white, transparent)",
        }}
      >
        <div
          className="absolute inset-0 translate-x-[-100%] animate-[shimmer_2s_infinite]"
          style={{
            background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
            animation: `shimmer ${shimmerDuration} infinite`,
          }}
        />
      </div>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

// Add the keyframes to your global CSS or style tag
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = shimmerKeyframes;
document.head.appendChild(styleSheet); 