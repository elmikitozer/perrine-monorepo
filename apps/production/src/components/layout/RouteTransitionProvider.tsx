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
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface RouteTransitionContextValue {
  navigateTo: (href: string) => void;
  navigateBack: () => void;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

const DURATION = 0.38;
const COVERED_HOLD_MS = 260;
const EASE = [0.76, 0, 0.24, 1] as const;

export function RouteTransitionProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const isTransitioningRef = useRef(false);
  const [curtainActive, setCurtainActive] = useState(false);

  // 1 = below screen, 0 = covering, -1 = above screen
  const curtainProgress = useMotionValue(1);
  const curtainY = useTransform(curtainProgress, (v) => `${v * 100}%`);
  // Le monogramme contre-glisse dans le rideau pour un effet de parallaxe,
  // et n'est pleinement visible que lorsque l'écran est couvert.
  const logoY = useTransform(curtainProgress, (v) => `${v * -35}%`);
  const logoOpacity = useTransform(curtainProgress, [-0.55, 0, 0.55], [0, 1, 0]);
  const logoScale = useTransform(curtainProgress, [-1, 0, 1], [1.08, 1, 0.92]);

  const runCurtain = useCallback(
    async (onCovered: () => void) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      curtainProgress.set(1);
      setCurtainActive(true);

      await animate(curtainProgress, 0, { duration: DURATION, ease: EASE });

      onCovered();

      await new Promise<void>((resolve) => setTimeout(resolve, COVERED_HOLD_MS));

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
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative h-28 w-28 md:h-36 md:w-36"
              style={{ y: logoY, opacity: logoOpacity, scale: logoScale }}
            >
              <Image
                src="/images/monogramme/monogramme-noir.png"
                alt=""
                fill
                sizes="144px"
                className="object-contain"
              />
            </motion.div>
          </div>
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
