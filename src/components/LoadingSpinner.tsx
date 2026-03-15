"use client";

type LoadingSpinnerProps = {
  /** Size: sm (24px), md (40px), lg (56px) */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-2",
  lg: "h-14 w-14 border-[3px]",
} as const;

export default function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-[#707164]/40 border-t-[#EAC84E] ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Laddar"
    />
  );
}
