"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

type LazyBackgroundProps = {
  src: string;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
};

/** Chỉ tải background image khi phần tử xuất hiện trong viewport */
export default function LazyBackground({
  src,
  children = null,
  className = "",
  style = {},
  ...props
}: LazyBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setLoaded(true),
      { rootMargin: "100px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        backgroundImage: loaded ? `url(${src})` : undefined,
      }}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </div>
  );
}
