'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface RouteTransitionContextValue {
  navigateTo: (href: string) => void;
  navigateBack: () => void;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

const DURATION = 0.38;
const EASE = [0.76, 0, 0.24, 1] as const;

export function RouteTransitionProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const isTransitioningRef = useRef(false);
  const [curtainActive, setCurtainActive] = useState(false);

  // 1 = below screen, 0 = covering, -1 = above screen
  const curtainProgress = useMotionValue(1);
  const curtainY = useTransform(curtainProgress, (v) => `${v * 100}%`);

  const runCurtain = useCallback(
    async (onCovered: () => void) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      curtainProgress.set(1);
      setCurtainActive(true);

      await animate(curtainProgress, 0, { duration: DURATION, ease: EASE });

      onCovered();

      await new Promise<void>((resolve) => setTimeout(resolve, 150));

      await animate(curtainProgress, -1, { duration: DURATION, ease: EASE });

      setCurtainActive(false);
      curtainProgress.set(1);
      isTransitioningRef.current = false;
    },
    [curtainProgress],
  );

  const navigateTo = useCallback(
    (href: string) => {
      void runCurtain(() => router.push(href));
    },
    [router, runCurtain],
  );

  const navigateBack = useCallback(
    () => {
      void runCurtain(() => router.back());
    },
    [router, runCurtain],
  );

  const value = useMemo<RouteTransitionContextValue>(
    () => ({ navigateTo, navigateBack }),
    [navigateTo, navigateBack],
  );

  return (
    <RouteTransitionContext.Provider value={value}>
      {children}
      {curtainActive && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[60]"
          style={{ y: curtainY, backgroundColor: '#e9dde3' }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/motifs/jpg/vuittonage_rose.jpg')",
              backgroundSize: '260px',
              mixBlendMode: 'soft-light',
              opacity: 0.24,
            }}
          />
        </motion.div>
      )}
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);
  if (!context) {
    throw new Error('useRouteTransition must be used inside RouteTransitionProvider');
  }
  return context;
}
