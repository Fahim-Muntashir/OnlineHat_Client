"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  className,
  suffix = "",
  prefix = "",
}: CountUpProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  const count = useMotionValue(from);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration: duration,
        delay: delay,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (nodeRef.current) {
            nodeRef.current.textContent = 
              prefix + Math.floor(latest).toLocaleString() + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to, count, duration, delay, prefix, suffix]);

  return (
    <span ref={nodeRef} className={className}>
      {prefix}{from.toLocaleString()}{suffix}
    </span>
  );
}
