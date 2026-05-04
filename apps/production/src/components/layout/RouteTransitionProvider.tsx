'use client';

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

type Rect = { left: number; top: number; width: number; height: number };
type Direction = 'forward' | 'reverse';

interface PendingTransition {
  direction: Direction;
  slug: string;
  fromRect: Rect;
  imageUrl: string | null;
  href: string;
  homeScrollY: number;
}

interface OverlayState {
  visible: boolean;
  imageUrl: string | null;
  baseWidth: number;
  baseHeight: number;
}

interface RouteTransitionContextValue {
  startForwardTransition: (input: {
    slug: string;
    href: string;
    fromEl: HTMLElement;
    imageUrl: string | null;
  }) => void;
  reverseToHomeFromHero: () => void;
  registerHomeCard: (slug: string, element: HTMLElement | null) => void;
  registerProjectHero: (input: {
    slug: string;
    element: HTMLElement | null;
    imageUrl: string | null;
  }) => void;
  hiddenHomeSlug: string | null;
  hideProjectHero: boolean;
  projectChromeVisible: boolean;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

const toRect = (element: HTMLElement): Rect => {
  const rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
};

const getImageFromElement = (element: HTMLElement | null): HTMLImageElement | null => {
  if (!element) return null;
  const img = element.querySelector('img');
  return img instanceof HTMLImageElement ? img : null;
};

const waitForElementImageReady = async (element: HTMLElement | null, timeoutMs = 550) => {
  const img = getImageFromElement(element);
  if (!img) return;
  if (img.complete && img.naturalWidth > 0) return;

  await new Promise<void>((resolve) => {
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      img.removeEventListener('load', finish);
      img.removeEventListener('error', finish);
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    img.addEventListener('load', finish, { once: true });
    img.addEventListener('error', finish, { once: true });
  });
};

const waitFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

const lockBodyScroll = (
  overflowRef: { current: string },
  paddingRightRef: { current: string },
) => {
  overflowRef.current = document.body.style.overflow;
  paddingRightRef.current = document.body.style.paddingRight;

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
};

const unlockBodyScroll = (
  overflowRef: { current: string },
  paddingRightRef: { current: string },
) => {
  document.body.style.overflow = overflowRef.current;
  document.body.style.paddingRight = paddingRightRef.current;
};

export function RouteTransitionProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  const homeCardsRef = useRef(new Map<string, HTMLElement>());
  const projectHeroRef = useRef<HTMLElement | null>(null);
  const projectHeroSlugRef = useRef<string | null>(null);
  const projectHeroImageRef = useRef<string | null>(null);
  const isTransitioningRef = useRef(false);
  const homeScrollYRef = useRef(0);
  const bodyOverflowBeforeLockRef = useRef<string>('');
  const bodyPaddingRightBeforeLockRef = useRef<string>('');
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [pending, setPending] = useState<PendingTransition | null>(null);
  const [homeRegistryVersion, setHomeRegistryVersion] = useState(0);
  const [heroVersion, setHeroVersion] = useState(0);
  const [overlay, setOverlay] = useState<OverlayState>({
    visible: false,
    imageUrl: null,
    baseWidth: 0,
    baseHeight: 0,
  });
  const [hiddenHomeSlug, setHiddenHomeSlug] = useState<string | null>(null);
  const [hideProjectHero, setHideProjectHero] = useState(false);
  const [projectChromeVisible, setProjectChromeVisible] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);

  const resetTransition = useCallback(() => {
    if (transitionTimeoutRef.current !== null) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    setPending(null);
    isTransitioningRef.current = false;
    unlockBodyScroll(bodyOverflowBeforeLockRef, bodyPaddingRightBeforeLockRef);
    setOverlay({ visible: false, imageUrl: null, baseWidth: 0, baseHeight: 0 });
    setProjectChromeVisible(true);
    setHideProjectHero(false);
    setHiddenHomeSlug(null);
  }, []);

  const runFlipAnimation = useCallback(
    async (input: {
      direction: Direction;
      fromRect: Rect;
      toRect: Rect;
      imageUrl: string | null;
      slug: string;
      targetElement: HTMLElement | null;
    }) => {
      const { direction, fromRect, toRect, imageUrl, slug, targetElement } = input;

      if (transitionTimeoutRef.current !== null) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }

      if (direction === 'forward') {
        setHideProjectHero(true);
        setProjectChromeVisible(false);
      } else {
        setHiddenHomeSlug(slug);
      }

      x.set(fromRect.left);
      y.set(fromRect.top);
      scaleX.set(1);
      scaleY.set(1);
      setOverlay({
        visible: true,
        imageUrl,
        baseWidth: fromRect.width,
        baseHeight: fromRect.height,
      });

      const springTransition = {
        type: 'spring' as const,
        stiffness: direction === 'forward' ? 174 : 204,
        damping: direction === 'forward' ? 33 : 35,
        mass: 0.85,
      };

      await Promise.all([
        animate(x, toRect.left, springTransition),
        animate(y, toRect.top, springTransition),
        animate(scaleX, toRect.width / fromRect.width, springTransition),
        animate(scaleY, toRect.height / fromRect.height, springTransition),
      ]);

      if (direction === 'forward') {
        setProjectChromeVisible(true);
        setHideProjectHero(false);
        await waitForElementImageReady(targetElement);
        await waitFrame();
        await waitFrame();
      } else {
        setHiddenHomeSlug(null);
        await waitForElementImageReady(targetElement);
        await waitFrame();
        await waitFrame();
      }

      setOverlay({ visible: false, imageUrl: null, baseWidth: 0, baseHeight: 0 });
      setPending(null);
      isTransitioningRef.current = false;
      unlockBodyScroll(bodyOverflowBeforeLockRef, bodyPaddingRightBeforeLockRef);
    },
    [scaleX, scaleY, x, y],
  );

  const startForwardTransition = useCallback(
    ({ slug, href, fromEl, imageUrl }: { slug: string; href: string; fromEl: HTMLElement; imageUrl: string | null }) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      homeScrollYRef.current = window.scrollY;
      lockBodyScroll(bodyOverflowBeforeLockRef, bodyPaddingRightBeforeLockRef);
      setProjectChromeVisible(false);
      const sourceRect = toRect(fromEl);
      const sourceImageUrl = getImageFromElement(fromEl)?.currentSrc || imageUrl;
      setPending({
        direction: 'forward',
        slug,
        href,
        fromRect: sourceRect,
        imageUrl: sourceImageUrl,
        homeScrollY: homeScrollYRef.current,
      });
      x.set(sourceRect.left);
      y.set(sourceRect.top);
      scaleX.set(1);
      scaleY.set(1);
      setOverlay({
        visible: true,
        imageUrl: sourceImageUrl,
        baseWidth: sourceRect.width,
        baseHeight: sourceRect.height,
      });
      router.push(href);
      transitionTimeoutRef.current = setTimeout(resetTransition, 4000);
    },
    [resetTransition, router, scaleX, scaleY, x, y],
  );

  const reverseToHomeFromHero = useCallback(() => {
    if (isTransitioningRef.current) return;
    if (!projectHeroRef.current || !projectHeroSlugRef.current) {
      router.push('/');
      return;
    }

    isTransitioningRef.current = true;
    lockBodyScroll(bodyOverflowBeforeLockRef, bodyPaddingRightBeforeLockRef);
    setHiddenHomeSlug(projectHeroSlugRef.current);
    const sourceRect = toRect(projectHeroRef.current);
    const sourceImageUrl = getImageFromElement(projectHeroRef.current)?.currentSrc || projectHeroImageRef.current;
    setPending({
      direction: 'reverse',
      slug: projectHeroSlugRef.current,
      href: '/',
      fromRect: sourceRect,
      imageUrl: sourceImageUrl,
      homeScrollY: homeScrollYRef.current,
    });
    x.set(sourceRect.left);
    y.set(sourceRect.top);
    scaleX.set(1);
    scaleY.set(1);
    setOverlay({
      visible: true,
      imageUrl: sourceImageUrl,
      baseWidth: sourceRect.width,
      baseHeight: sourceRect.height,
    });
    router.push('/');
    transitionTimeoutRef.current = setTimeout(resetTransition, 4000);
  }, [resetTransition, router, scaleX, scaleY, x, y]);

  const registerHomeCard = useCallback((slug: string, element: HTMLElement | null) => {
    if (element) {
      homeCardsRef.current.set(slug, element);
    } else {
      homeCardsRef.current.delete(slug);
    }
    setHomeRegistryVersion((value) => value + 1);
  }, []);

  const registerProjectHero = useCallback(
    ({ slug, element, imageUrl }: { slug: string; element: HTMLElement | null; imageUrl: string | null }) => {
      if (element) {
        projectHeroRef.current = element;
        projectHeroSlugRef.current = slug;
        projectHeroImageRef.current = imageUrl;
      } else {
        projectHeroRef.current = null;
        projectHeroSlugRef.current = null;
        projectHeroImageRef.current = null;
      }
      setHeroVersion((value) => value + 1);
    },
    [],
  );

  useLayoutEffect(() => {
    if (!pending) return;

    if (pending.direction === 'forward') {
      if (!pathname.startsWith('/projects/')) return;
      if (projectHeroSlugRef.current !== pending.slug || !projectHeroRef.current) return;

      void runFlipAnimation({
        direction: 'forward',
        slug: pending.slug,
        fromRect: pending.fromRect,
        toRect: toRect(projectHeroRef.current),
        imageUrl: pending.imageUrl,
        targetElement: projectHeroRef.current,
      });
      return;
    }

    if (pathname !== '/') return;

    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = Math.min(pending.homeScrollY, Math.max(0, maxScrollY));
    if (Math.abs(window.scrollY - targetScrollY) > 1) {
      window.scrollTo({ top: targetScrollY, behavior: 'auto' });
      requestAnimationFrame(() => {
        setHomeRegistryVersion((value) => value + 1);
      });
      return;
    }

    const destination = homeCardsRef.current.get(pending.slug);
    if (!destination) return;

    void runFlipAnimation({
      direction: 'reverse',
      slug: pending.slug,
      fromRect: pending.fromRect,
      toRect: toRect(destination),
      imageUrl: pending.imageUrl,
      targetElement: destination,
    });
  }, [heroVersion, homeRegistryVersion, pathname, pending, runFlipAnimation]);

  const value = useMemo<RouteTransitionContextValue>(
    () => ({
      startForwardTransition,
      reverseToHomeFromHero,
      registerHomeCard,
      registerProjectHero,
      hiddenHomeSlug,
      hideProjectHero,
      projectChromeVisible,
    }),
    [
      hiddenHomeSlug,
      hideProjectHero,
      projectChromeVisible,
      registerHomeCard,
      registerProjectHero,
      reverseToHomeFromHero,
      startForwardTransition,
    ],
  );

  return (
    <RouteTransitionContext.Provider value={value}>
      {children}
      {overlay.visible && (
        <div className="pointer-events-none fixed inset-0 z-[60]">
          <motion.div
            className="absolute overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
            style={{
              left: x,
              top: y,
              width: overlay.baseWidth,
              height: overlay.baseHeight,
              scaleX,
              scaleY,
              transformOrigin: 'top left',
              backgroundColor: '#e9dde3',
              backgroundImage: overlay.imageUrl ? `url('${overlay.imageUrl}')` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              willChange: 'transform',
            }}
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
        </div>
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
