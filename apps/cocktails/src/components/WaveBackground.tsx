'use client';

import Image from 'next/image';

interface WaveBackgroundProps {
  variant?: 'yellow' | 'red';
  children: React.ReactNode;
  className?: string;
}

export function WaveBackground({ variant = 'yellow', children, className = '' }: WaveBackgroundProps) {
  const isYellow = variant === 'yellow';

  // Background colors based on brand guidelines
  const bgColor = isYellow ? '#ffe500' : '#e4032d';

  return (
    <div className={`relative ${className}`} style={{ backgroundColor: bgColor }}>
      {/* Fixed background shapes container */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Forme 1 - Top left */}
        <div className="absolute -top-24 -left-24 w-[280px] h-[280px] md:w-[420px] md:h-[420px] opacity-60">
          <Image
            src="/1805_2502_Forme.png"
            alt=""
            fill
            className="object-contain"
            quality={100}
            sizes="(min-width: 768px) 420px, 280px"
            aria-hidden="true"
          />
        </div>

        {/* Forme 3 - Mid right */}
        <div className="absolute top-1/2 -right-24 -translate-y-1/2 w-[360px] h-[360px] md:w-[520px] md:h-[520px] opacity-45">
          <Image
            src="/1805_2502_Forme3.png"
            alt=""
            fill
            className="object-contain"
            quality={100}
            sizes="(min-width: 768px) 520px, 360px"
            aria-hidden="true"
          />
        </div>

        {/* Forme 2 - Mid left */}
        <div className="absolute top-1/3 -left-36 w-[260px] h-[260px] md:w-[360px] md:h-[360px] opacity-45">
          <Image
            src="/1805_2502_Forme2.png"
            alt=""
            fill
            className="object-contain"
            quality={100}
            sizes="(min-width: 768px) 360px, 260px"
            aria-hidden="true"
          />
        </div>

        {/* Forme 3 - Bottom left */}
        <div className="absolute -bottom-28 -left-20 w-[340px] h-[340px] md:w-[480px] md:h-[480px] opacity-45 rotate-180">
          <Image
            src="/1805_2502_Forme3.png"
            alt=""
            fill
            className="object-contain"
            quality={100}
            sizes="(min-width: 768px) 480px, 340px"
            aria-hidden="true"
          />
        </div>

        {/* Forme 1 - Upper right */}
        <div className="absolute top-12 -right-20 w-[220px] h-[220px] md:w-[320px] md:h-[320px] opacity-45 -rotate-12">
          <Image
            src="/1805_2502_Forme.png"
            alt=""
            fill
            className="object-contain"
            quality={100}
            sizes="(min-width: 768px) 320px, 220px"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
