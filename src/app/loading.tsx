import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-brand animate-spin" />
        <div className="absolute inset-0 blur-lg bg-brand/30 -z-10 animate-pulse" />
      </div>
      <p className="text-sm font-bold text-gray-300 animate-pulse tracking-wide">
        Memuat Ruang Komik...
      </p>
    </div>
  );
}
