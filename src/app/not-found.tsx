import React from 'react';
import Link from 'next/link';
import { BookOpen, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-dark-card border-2 border-brand/40 shadow-glow-gold flex items-center justify-center mx-auto text-brand">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>
        <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-crimson text-white text-xs font-black rounded-full shadow-lg">
          404
        </span>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-dark-muted">
          Sepertinya komik atau halaman yang kamu cari tersesat ke dimensi lain atau telah dipindahkan.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-brand text-black font-extrabold text-sm flex items-center gap-2 hover:bg-yellow-400 shadow-glow-gold transition"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
        <Link
          href="/pustaka"
          className="px-5 py-3 rounded-xl bg-dark-card border border-dark-border text-sm font-bold text-gray-300 hover:text-brand hover:border-brand/40 transition"
        >
          <Compass className="w-4 h-4" />
          Jelajahi Pustaka
        </Link>
      </div>
    </div>
  );
}
