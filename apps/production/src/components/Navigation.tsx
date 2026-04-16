'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-sm bg-gray-50/80' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-70 transition-opacity duration-300">
          <Image
            src="/images/logo/logotype-c.png"
            alt="PV Studio"
            width={360}
            height={96}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/"
            className={`nav-link text-gray-900 ${pathname === '/' ? 'active' : ''}`}
          >
            Work
          </Link>
          <Link
            href="/about"
            className={`nav-link text-gray-900 ${pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
