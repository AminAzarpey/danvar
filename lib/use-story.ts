'use client';
import { useEffect, useRef, useState } from 'react';

export const chapterIds = ['hello', 'people', 'experience', 'tools', 'idea'];

/** Keep animation ticks outside React; update state only at chapter boundaries. */
export function useStory() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(true);
  const progress = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const frame = requestAnimationFrame(() => {
      const initial = Math.max(0, chapterIds.indexOf(location.hash.slice(1)));
      let seen = false;
      try {
        seen = !!sessionStorage.getItem('danvar-seen');
        sessionStorage.setItem('danvar-seen', '1');
      } catch {
        /* Storage is optional. */
      }
      setStep(initial);
      setReduced(media.matches);
      setPlaying(!media.matches && !seen && initial === 0);
    });
    const pause = () => {
      if (document.hidden) setPlaying(false);
    };
    const motion = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    document.addEventListener('visibilitychange', pause);
    media.addEventListener('change', motion);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', pause);
      media.removeEventListener('change', motion);
    };
  }, []);

  useEffect(() => {
    if (!playing || step === 4) return;
    const duration = step === 0 ? 8000 : 12000;
    let previous = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      elapsed.current += now - previous;
      previous = now;
      const bar = progress.current?.children[step]?.firstElementChild as HTMLElement | null;
      if (bar) bar.style.transform = `scaleX(${Math.min(1, elapsed.current / duration)})`;
      if (elapsed.current >= duration) {
        elapsed.current = 0;
        setStep(step + 1);
        if (step === 3) setPlaying(false);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [playing, step]);

  function go(next: number) {
    setPlaying(false);
    elapsed.current = 0;
    setStep(next);
    history.replaceState(null, '', '#' + chapterIds[next]);
  }
  function toggle() {
    if (step === 4) {
      elapsed.current = 0;
      setStep(0);
    }
    setPlaying((value) => !value);
  }
  return { step, playing, setPlaying, reduced, setReduced, progress, go, toggle };
}
