import { useEffect, useRef, useState } from "react";

export default function CountUp({
  end,
  durationMs = 1200,
  delayMs = 0,
  formatter,
  className,
}: {
  end: number;
  durationMs?: number;
  delayMs?: number;
  formatter?: (value: number) => string;
  className?: string;
}) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now() + delayMs;
    startRef.current = start;

    const step = (now: number) => {
      if (now < start) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(end * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, durationMs, delayMs]);

  const defaultFormat = (n: number) => n.toLocaleString();
  const display = (formatter ?? defaultFormat)(value);

  return <span className={className}>{display}</span>;
}
