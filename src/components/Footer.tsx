'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BookOpen, Heart, ArrowUp, Sparkles, Shield, Compass } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/baca')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-dark-surface border-t border-dark-border mt-20 relative overflow-hidden">
      {/* Subtle halftone background */}
      <div className="absolute inset-0 bg-halftone-dark opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand/80 shadow-glow-gold bg-black">
                <Image
                  src="/images/logo.png"
                  alt="Komik Verse"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  KOMIK VERSE
                </span>
                <p className="text-xs text-dark-muted uppercase font-bold tracking-wider">
                  Read More Worlds
                </p>
              </div>
            </Link>
            <p className="text-sm text-dark-muted leading-relaxed max-w-md">
              Platform baca komik online terlengkap dan gratis dalam Bahasa Indonesia. Temukan ribuan manga, manhwa, dan manhua terpopuler dengan update tercepat dan pengalaman membaca modern tanpa jeda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-100 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand" />
              Eksplorasi
            </h4>
            <ul className="space-y-2 text-sm text-dark-muted">
              <li>
                <Link href="/pustaka?tipe=manhwa" className="hover:text-brand transition">
                  Manhwa Korea
                </Link>
              </li>
              <li>
                <Link href="/pustaka?tipe=manga" className="hover:text-brand transition">
                  Manga Jepang
                </Link>
              </li>
              <li>
                <Link href="/pustaka?tipe=manhua" className="hover:text-brand transition">
                  Manhua China
                </Link>
              </li>
              <li>
                <Link href="/genre" className="hover:text-brand transition">
                  Daftar Semua Genre
                </Link>
              </li>
            </ul>
          </div>

          {/* User Links & Action */}
          <div>
            <h4 className="text-sm font-bold text-gray-100 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand" />
              Fitur Pengguna
            </h4>
            <ul className="space-y-2 text-sm text-dark-muted">
              <li>
                <Link href="/favorit" className="hover:text-brand transition">
                  Koleksi Favorit
                </Link>
              </li>
              <li>
                <Link href="/riwayat" className="hover:text-brand transition">
                  Riwayat Bacaan
                </Link>
              </li>
              <li>
                <Link href="/genre/action" className="hover:text-brand transition">
                  Komik Action Terpopuler
                </Link>
              </li>
              <li>
                <Link href="/genre/isekai" className="hover:text-brand transition">
                  Komik Isekai & Reinkarnasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dark-muted">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} <strong className="text-gray-300">Komik Verse</strong>. Seluruh konten komik merupakan hak cipta penerbit & kreator masing-masing.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border hover:border-brand hover:text-brand transition"
          >
            <span>Kembali ke atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
