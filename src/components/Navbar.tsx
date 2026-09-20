'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  LayoutGrid,
  Bookmark,
  History,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isHiddenPage =
    pathname.startsWith('/komik') ||
    pathname.startsWith('/baca') ||
    pathname.startsWith('/dev');

  // Bottom tab bar is shown on Beranda, Pustaka, Genre, Favorit, and Riwayat
  const showBottomTabBar = !isHiddenPage;

  const navTabs = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Pustaka', href: '/pustaka', icon: BookOpen },
    { name: 'Genre', href: '/genre', icon: LayoutGrid },
    { name: 'Favorit', href: '/favorit', icon: Bookmark },
    { name: 'Riwayat', href: '/riwayat', icon: History },
  ];

  const isTabActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 1. Top Header ONLY on Beranda ('/') */}
      {isHome && (
        <header className="relative w-full bg-dark-void border-b border-dark-border/40 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Logo Brand */}
              <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-brand/80 shadow-glow-gold group-hover:scale-105 transition bg-black">
                  <Image
                    src="/images/logo.png"
                    alt="Komik Verse"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base sm:text-xl font-black tracking-tight text-brand group-hover:text-yellow-400 transition">
                    KOMIK VERSE
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-dark-muted -mt-0.5">
                    Read More Worlds
                  </span>
                </div>
              </Link>

              {/* Right Side: Desktop Nav + Circular Developer Avatar */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Desktop Tab Bar */}
                <nav className="hidden md:flex items-center p-1.5 rounded-2xl bg-dark-card border border-dark-border shadow-inner">
                  {navTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = isTabActive(tab.href);

                    return (
                      <Link
                        key={tab.name}
                        href={tab.href}
                        prefetch={true}
                        className={`relative px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                          isActive
                            ? 'bg-brand text-black shadow-glow-gold'
                            : 'text-gray-300 hover:text-white hover:bg-dark-surface'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Circular Developer Avatar on Top Right */}
                <Link
                  href="/dev"
                  prefetch={true}
                  className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-brand shadow-[0_0_12px_rgba(245,158,11,0.4)] hover:border-yellow-400 hover:scale-110 active:scale-95 transition shrink-0 group ring-2 ring-brand/30 bg-black"
                  title="Info Developer & Pasang Aplikasi (Kuzuroken)"
                >
                  <Image
                    src="/images/kuzu.png"
                    alt="Kuzuroken"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    priority
                  />
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 2. Floating Bottom Tab Bar (Shown on Beranda, Pustaka, Genre, Favorit, Riwayat) */}
      {showBottomTabBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 pb-safe pointer-events-auto md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:inset-x-auto md:w-auto">
          <div className="mx-3 mb-3 md:mx-0 md:mb-0 p-1.5 rounded-2xl bg-dark-surface/95 backdrop-blur-xl border border-dark-border shadow-2xl">
            <nav className="grid grid-cols-5 md:flex md:items-center gap-1 md:gap-1.5">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = isTabActive(tab.href);

                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    prefetch={true}
                    className={`flex flex-col md:flex-row items-center justify-center py-2 px-1 md:px-4 md:py-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-brand text-black font-black shadow-glow-gold'
                        : 'text-dark-muted hover:text-gray-200 hover:bg-dark-card/60'
                    }`}
                  >
                    <Icon className={`w-5 h-5 md:w-4 md:h-4 mb-0.5 md:mb-0 md:mr-2 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                    <span className="text-[10px] md:text-xs font-bold tracking-tight">{tab.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
