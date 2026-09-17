'use client';
import { useEffect, useSyncExternalStore } from 'react';
import palettes from '@/content/nude-palettes.json';

type Appearance = { palette: string; mode: string; pinned: boolean };
const fallback: Appearance = { palette: 'almond', mode: 'system', pinned: false };
let snapshot = fallback;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (snapshot === fallback) {
    const root = document.documentElement;
    let pinned = false;
    try {
      pinned = !!JSON.parse(localStorage.getItem('danvar-look') || 'null')?.palette;
    } catch {
      /* Optional storage. */
    }
    snapshot = {
      palette: root.dataset.palette || 'almond',
      mode: root.dataset.mode || 'system',
      pinned,
    };
  }
  return () => {
    listeners.delete(listener);
  };
}
export function useAppearance() {
  const appearance = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => fallback
  );
  useEffect(() => {
    // Hydration uses the fallback snapshot; preserve the pre-paint theme until subscribed.
    if (appearance === fallback) return;
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const theme =
        appearance.mode === 'system' ? (media.matches ? 'dark' : 'light') : appearance.mode;
      const palette =
        palettes.palettes.find((p) => p.id === appearance.palette) || palettes.palettes[0];
      const root = document.documentElement;
      root.dataset.theme = theme;
      root.dataset.mode = appearance.mode;
      root.dataset.palette = palette.id;
      root.style.colorScheme = theme;
      Object.entries(theme === 'dark' ? palette.dark : palette.light).forEach(([key, value]) =>
        root.style.setProperty('--' + key, value)
      );
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [appearance]);
  function look(palette: string, mode: string, pinned: boolean) {
    snapshot = { palette, mode, pinned };
    try {
      sessionStorage.setItem('danvar-palette', palette);
      localStorage.setItem(
        'danvar-look',
        JSON.stringify({ version: 1, mode, palette: pinned ? palette : null })
      );
    } catch {
      /* Settings still work in memory. */
    }
    listeners.forEach((listener) => listener());
  }
  return { ...appearance, look };
}
