'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Globe,
  Instagram,
  Coffee,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Download,
} from 'lucide-react';

export default function DevInfoPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installStatus, setInstallStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check if app is installed (standalone mode)
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }

      if (window.deferredPWAInstallPrompt) {
        setDeferredPrompt(window.deferredPWAInstallPrompt);
      }

      const handleReady = () => {
        if (window.deferredPWAInstallPrompt) {
          setDeferredPrompt(window.deferredPWAInstallPrompt);
        }
      };

      const handleInstalled = () => {
        setIsInstalled(true);
        setInstallStatus('Aplikasi Ruang Komik berhasil dipasang!');
      };

      window.addEventListener('pwa_prompt_ready', handleReady);
      window.addEventListener('appinstalled', handleInstalled);

      return () => {
        window.removeEventListener('pwa_prompt_ready', handleReady);
        window.removeEventListener('appinstalled', handleInstalled);
      };
    }
  }, []);

  const handleInstallPWA = async () => {
    const promptEvent = deferredPrompt || (typeof window !== 'undefined' ? window.deferredPWAInstallPrompt : null);

    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setInstallStatus('Memasang aplikasi ke layar utama...');
        }
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') {
          window.deferredPWAInstallPrompt = null;
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (isInstalled) {
      setInstallStatus('Ruang Komik sudah terpasang di perangkat Anda!');
    } else {
      // Fallback instructions if browser already prompted or manual installation is required
      setInstallStatus(
        'Untuk memasang di perangkat: Klik menu browser (titik tiga ⋮ atau tombol Share) lalu pilih "Tambahkan ke Layar Utama" / "Install App"'
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 py-10 sm:py-16 overflow-x-hidden">
      {/* Dynamic Full Screen Backgrounds (Desktop & Mobile) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Mobile Background */}
        <div className="block md:hidden w-full h-full relative">
          <Image
            src="/images/bgdevmobile.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        {/* Desktop Background */}
        <div className="hidden md:block w-full h-full relative">
          <Image
            src="/images/bgdevdekstop.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />
      </div>

      {/* Main Developer Info Card */}
      <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
        {/* Avatar Profile */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-brand via-red-500 to-yellow-400 shadow-[0_0_35px_rgba(245,158,11,0.5)]">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-black bg-black relative">
            <Image
              src="/images/del.png"
              alt="FadelSM"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Brand & Author Header */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            Ruang<span className="text-brand">Komik</span>
          </h1>
          <p className="text-xs sm:text-sm font-black tracking-[0.25em] text-black uppercase drop-shadow-sm">
            BY FADELSM
          </p>
        </div>

        {/* Description with text-justify */}
        <p className="text-xs sm:text-sm text-gray-100 leading-relaxed max-w-sm mx-auto text-justify px-2 font-medium drop-shadow-sm">
          Platform baca komik, manhwa, manga, dan manhua modern dan gratis tanpa iklan.
          Nikmati berbagai cerita seru, simpan koleksi favoritmu, dan baca chapter terbaru setiap hari
          dengan pengalaman membaca yang nyaman tanpa batasan.
        </p>

        {/* Social Links Row (3 Buttons - Solid Black Box Styling) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-1">
          {/* Website */}
          <a
            href="https://fadelsm.biz.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black border border-white/10 hover:border-white/30 hover:bg-zinc-900 transition-all duration-200 group shadow-2xl"
          >
            <Globe className="w-5 h-5 text-gray-200 group-hover:text-brand transition mb-1" />
            <span className="text-[11px] font-bold text-gray-200 group-hover:text-white">
              Website
            </span>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@fadelsm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black border border-white/10 hover:border-pink-500/50 hover:bg-zinc-900 transition-all duration-200 group shadow-2xl"
          >
            {/* TikTok Custom SVG Icon */}
            <svg
              className="w-5 h-5 text-gray-200 group-hover:text-pink-400 transition mb-1 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.71a8.21 8.21 0 0 0 4.92 1.63v-3.65a4.85 4.85 0 0 1-1-.001Z" />
            </svg>
            <span className="text-[11px] font-bold text-gray-200 group-hover:text-white">
              TikTok
            </span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/fadelshafwanmaliki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black border border-white/10 hover:border-red-500/50 hover:bg-zinc-900 transition-all duration-200 group shadow-2xl"
          >
            <Instagram className="w-5 h-5 text-gray-200 group-hover:text-red-400 transition mb-1" />
            <span className="text-[11px] font-bold text-gray-200 group-hover:text-white">
              Instagram
            </span>
          </a>
        </div>

        {/* Action List Cards - Solid Black Box Styling */}
        <div className="space-y-3 pt-1">
          {/* Saweria Donation Card */}
          <a
            href="https://saweria.co/fadelsm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-black border border-white/10 hover:border-white/30 hover:bg-zinc-900 transition-all duration-200 group shadow-2xl"
          >
            <div className="flex items-center gap-3.5 text-left min-w-0">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-400 group-hover:scale-110 transition shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-brand transition">
                  Like what I do?
                </h3>
                <p className="text-[11px] text-gray-400 truncate">
                  Buy me a coffee on Saweria
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brand transition shrink-0 ml-2" />
          </a>

          {/* PWA Install Button Card */}
          <button
            type="button"
            onClick={handleInstallPWA}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-black border border-white/10 hover:border-brand/60 hover:bg-zinc-900 transition-all duration-200 group shadow-2xl text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand group-hover:scale-110 transition shrink-0">
                {isInstalled ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Smartphone className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-brand transition flex items-center gap-1.5">
                  <span>Pasang Aplikasi (PWA)</span>
                  {isInstalled && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Terpasang
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-gray-400 truncate">
                  Akses cepat di layar utama
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-brand group-hover:translate-y-0.5 transition shrink-0 ml-2" />
          </button>

          {/* Install Status Toast/Alert */}
          {installStatus && (
            <div className="p-3.5 rounded-xl bg-black/95 border border-brand/50 text-xs text-brand font-bold animate-in fade-in duration-200 shadow-2xl text-center leading-relaxed">
              {installStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
