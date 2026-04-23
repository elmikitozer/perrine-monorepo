'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const SPLASH_DURATION_MS = 2000;
const SPLASH_SESSION_KEY = 'pv-studio-initial-splash-seen';
const FORCE_SPLASH_EVERY_LOAD = true;

export default function InitialSplash() {
  const [isVisible, setIsVisible] = useState(false);

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

    setIsVisible(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timeoutId = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setIsVisible(false);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="initial-splash"
      aria-hidden="true"
      style={{ '--splash-duration': `${SPLASH_DURATION_MS}ms` } as CSSProperties}
    >
      <div className="initial-splash__mark">
        <Image
          src="/images/monogramme/monogramme_clear.png"
          alt=""
          width={200}
          height={200}
          priority
          className="initial-splash__monogram"
        />
        <div className="initial-splash__sweep" />
      </div>
      <p className="initial-splash__label">Perrine Vael-Roquere Studio</p>
    </div>
  );
}
