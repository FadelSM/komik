'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ShieldAlert, RefreshCw, Lock } from 'lucide-react';

export default function AntiDevTools() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  // Check if DevTools is open using multi-vector detection
  const detectDevTools = useCallback(() => {
    if (typeof window === 'undefined') return;

    let detected = false;

    // Vector 1: Outer vs Inner Dimension Analysis (Docked DevTools)
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;

    if (widthDiff || heightDiff) {
      detected = true;
    }

    // Vector 2: Console Object / Getter Trigger (Undocked & Docked)
    const probe = new Image();
    Object.defineProperty(probe, 'id', {
      get: () => {
        detected = true;
        setIsDevToolsOpen(true);
      },
    });

    try {
      // Trigger evaluation in console
      console.log('%c', probe);
      console.clear();
    } catch {
      // Ignore errors
    }

    // Vector 3: Debugger Timing Check (High Precision)
    try {
      const start = performance.now();
      // Using dynamic constructor prevents static bundler elimination
      const debugFn = new Function('debugger');
      debugFn();
      const duration = performance.now() - start;
      if (duration > 100) {
        detected = true;
      }
    } catch {
      // Ignore errors
    }

    setIsDevToolsOpen((prev) => (prev !== detected ? detected : prev));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable DevTools & Source Viewing Shortcut Keys
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 key
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      const isModifier = e.ctrlKey || e.metaKey;

      if (isModifier) {
        const key = e.key.toLowerCase();

        // Ctrl/Cmd + Shift + I (DevTools Inspect)
        // Ctrl/Cmd + Shift + J (Console)
        // Ctrl/Cmd + Shift + C (Inspect Element)
        // Ctrl/Cmd + Shift + K (Firefox Console)
        // Ctrl/Cmd + Shift + E (Firefox Network)
        if (e.shiftKey && ['i', 'j', 'c', 'k', 'e'].includes(key)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl/Cmd + U (View Source)
        // Ctrl/Cmd + S (Save Page)
        // Ctrl/Cmd + P (Print Page)
        if (['u', 's', 'p'].includes(key)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    // 3. Disable Dragging of Images / Elements
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    // Attach listeners with capture phase for highest priority
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    window.addEventListener('resize', detectDevTools);

    // Periodic detection check
    const checkInterval = setInterval(detectDevTools, 1000);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      window.removeEventListener('resize', detectDevTools);
    };
  }, [detectDevTools]);

  if (!isDevToolsOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-dark-void/95 backdrop-blur-xl flex items-center justify-center p-4 select-none">
      <div className="max-w-md w-full bg-dark-surface border border-crimson/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl shadow-crimson/20 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Accents */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-crimson/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-crimson/10 border border-crimson/25 flex items-center justify-center mx-auto mb-5 text-crimson shadow-inner relative">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
          <Lock className="w-4 h-4 text-brand-500 absolute -bottom-1 -right-1 bg-dark-surface rounded-full p-0.5" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
          Akses Terbatas: DevTools Terdeteksi
        </h2>

        <p className="text-sm text-dark-muted leading-relaxed mb-6">
          Demi keamanan source code, privasi data, dan perlindungan konten di{' '}
          <span className="text-brand-400 font-bold">Ruang Komik</span>, fitur Inspect
          Element & Developer Tools dinonaktifkan.
        </p>

        {/* Instruction Card */}
        <div className="bg-dark-bg border border-dark-border rounded-xl p-4 mb-6 text-xs text-dark-muted text-left space-y-2">
          <p className="font-semibold text-gray-200 flex items-center gap-1.5">
            <span className="text-brand-400">💡</span> Cara melanjutkan:
          </p>
          <div className="space-y-1 pl-4 border-l-2 border-dark-border">
            <p>1. Tutup jendela Developer Tools / Inspect Element Anda.</p>
            <p>2. Layar proteksi ini akan otomatis terbuka kembali.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-amber-600 text-dark-void font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-brand-500/20 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Muat Ulang Halaman
        </button>
      </div>
    </div>
  );
}
