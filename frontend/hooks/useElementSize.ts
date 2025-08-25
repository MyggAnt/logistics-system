import { useEffect, useRef, useState } from 'react';

export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    update();

    const ro = new (window as any).ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const cr = (entry as any).contentRect || entry.target.getBoundingClientRect();
        setSize({ width: cr.width, height: cr.height });
      }
    });
    ro.observe(el);

    return () => {
      try { ro.disconnect(); } catch {}
    };
  }, []);

  return [ref, size] as const;
}


