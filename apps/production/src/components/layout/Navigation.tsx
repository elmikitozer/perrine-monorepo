'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const isProjectPage = pathname.startsWith('/projects/');

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#fdf8f9]/95 px-6 backdrop-blur md:px-8">
      <nav className="flex h-[var(--nav-height)] items-center justify-between">
        <Link
          href="/"
          onClick={(event) => {
            if (!isProjectPage) return;
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            router.back();
          }}
          className="flex items-center hover:opacity-70 transition-opacity duration-300"
        >
          <Image
            src="/images/logo/logotype_A_clear_borders.png"
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
            onClick={(event) => {
              if (!isProjectPage) return;
              event.preventDefault();
              router.back();
            }}
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
