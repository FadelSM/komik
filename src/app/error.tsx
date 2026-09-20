'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 border-2 border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-lg">
        <AlertCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-black text-white">
          Terjadi Kesalahan
        </h2>
        <p className="text-xs text-dark-muted">
          Gagal memuat konten dari server komik. Silakan coba muat ulang atau kembali ke halaman utama.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-brand text-black font-extrabold text-xs flex items-center gap-2 hover:bg-yellow-400 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Coba Lagi
        </button>
        <Link
          href="/"
          className="px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-xs font-bold text-gray-300 hover:text-white transition flex items-center gap-2"
        >
          <Home className="w-3.5 h-3.5" />
          Beranda
        </Link>
      </div>
    </div>
  );
}
