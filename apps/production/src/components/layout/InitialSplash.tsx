'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const SPLASH_DURATION_MS = 2000;
const EXIT_FADE_MS = 350;
const EXIT_DELAY_MS = 180;
const SPLASH_SESSION_KEY = 'pv-studio-initial-splash-seen';
const FORCE_SPLASH_EVERY_LOAD = false;

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

export default function InitialSplash() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenSplash = FORCE_SPLASH_EVERY_LOAD
      ? false
      : window.sessionStorage.getItem(SPLASH_SESSION_KEY) === 'true';

    if (prefersReducedMotion || hasSeenSplash) {
      return;
    }

    if (!FORCE_SPLASH_EVERY_LOAD) {
      window.sessionStorage.setItem(SPLASH_SESSION_KEY, 'true');
    }

    setIsMounted(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const start = window.performance.now();
    let frameId = 0;
    let exitTimeoutId = 0;
    let unmountTimeoutId = 0;

    const tick = (now: number) => {
      const rawProgress = Math.min((now - start) / SPLASH_DURATION_MS, 1);
      setProgress(easeInOutCubic(rawProgress));

      if (rawProgress < 1) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      exitTimeoutId = window.setTimeout(() => {
        setIsLeaving(true);

        unmountTimeoutId = window.setTimeout(() => {
          document.body.style.overflow = previousOverflow;
          setIsMounted(false);
        }, EXIT_FADE_MS);
      }, EXIT_DELAY_MS);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(exitTimeoutId);
      window.clearTimeout(unmountTimeoutId);
      document.body.style.overflow = previousOverflow;
      setIsMounted(false);
      setIsLeaving(false);
      setProgress(0);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`initial-splash ${isLeaving ? 'initial-splash--leaving' : ''}`}
    >
      <div className="initial-splash__stack">
        <div className="initial-splash__logo-shell">
          <Image
            src="/images/monogramme/monogramme_clear.png"
            alt=""
            fill
            priority
            sizes="220px"
            className="initial-splash__logo-base"
          />
          <div
            className="initial-splash__logo-reveal"
            style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}
          >
            <Image
              src="/images/monogramme/monogramme_dégradé_clear.png"
              alt=""
              fill
              priority
              sizes="220px"
              className="initial-splash__logo-overlay"
            />
          </div>
        </div>
      </div>

      <p className="initial-splash__label">Perrine Vael-Roquere Studio</p>
    </div>
  );
}
