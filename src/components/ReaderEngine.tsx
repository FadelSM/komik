'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Settings2,
  Sliders,
  ArrowLeft,
  Home,
  CheckCircle,
  X,
} from 'lucide-react';
import { ChapterDetail, ComicDetail, ReaderSettings } from '@/types';
import { extractSlugFromUrl } from '@/lib/utils';
import {
  getReaderSettings,
  saveReaderSettings,
  saveHistory,
} from '@/lib/storage';

interface ReaderEngineProps {
  chapterData: ChapterDetail;
  comicDetail?: ComicDetail | null;
  comicSlug: string;
  chapterSlug: string;
}

export default function ReaderEngine({
  chapterData,
  comicDetail,
  comicSlug,
  chapterSlug,
}: ReaderEngineProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<ReaderSettings>(getReaderSettings());
  const [showControls, setShowControls] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const images = chapterData.images || [];
  const chaptersList = comicDetail?.chapters?.list || [];

  const currentChapterIndex = chaptersList.findIndex((ch) => {
    const slug = extractSlugFromUrl(ch.url);
    return slug === chapterSlug || ch.title.toLowerCase().includes(chapterData.chapter);
  });

  const prevChapter =
    currentChapterIndex >= 0 && currentChapterIndex < chaptersList.length - 1
      ? chaptersList[currentChapterIndex + 1]
      : null;

  const nextChapter =
    currentChapterIndex > 0 ? chaptersList[currentChapterIndex - 1] : null;

  // Auto-record reading history
  useEffect(() => {
    if (comicSlug && chapterSlug) {
      saveHistory({
        slug: comicSlug,
        title: chapterData.series || comicDetail?.title || comicSlug,
        cover: chapterData.thumbnail || comicDetail?.cover || '',
        type: comicDetail?.type || 'Komik',
        chapterSlug,
        chapterTitle: `Chapter ${chapterData.chapter}`,
        progressPercent: 0,
      });
    }
  }, [comicSlug, chapterSlug, chapterData, comicDetail]);

  useEffect(() => {
    setSettings(getReaderSettings());
  }, []);

  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    const updated = saveReaderSettings(newSettings);
    setSettings(updated);
  };

  // Track scroll progress for Webtoon Mode
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, Math.round((window.scrollY / scrollHeight) * 100)));
        setProgressPercent(percent);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') {
        if (settings.mode === 'single') {
          if (currentPage < images.length - 1) setCurrentPage((p) => p + 1);
          else if (nextChapter) {
            const nSlug = extractSlugFromUrl(nextChapter.url);
            router.push(`/baca/${comicSlug}/${nSlug}`);
          }
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        if (settings.mode === 'single') {
          if (currentPage > 0) setCurrentPage((p) => p - 1);
          else if (prevChapter) {
            const pSlug = extractSlugFromUrl(prevChapter.url);
            router.push(`/baca/${comicSlug}/${pSlug}`);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, images.length, nextChapter, prevChapter, settings.mode, comicSlug, router]);

  const handleNextChapter = () => {
    if (nextChapter) {
      const nSlug = extractSlugFromUrl(nextChapter.url);
      router.push(`/baca/${comicSlug}/${nSlug}`);
    }
  };

  const handlePrevChapter = () => {
    if (prevChapter) {
      const pSlug = extractSlugFromUrl(prevChapter.url);
      router.push(`/baca/${comicSlug}/${pSlug}`);
    }
  };

  const handleChapterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetSlug = e.target.value;
    if (targetSlug) {
      router.push(`/baca/${comicSlug}/${targetSlug}`);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-dark-void">
      {/* Top Floating Header */}
      <header
        className={`fixed top-0 inset-x-0 z-40 bg-dark-surface/95 backdrop-blur-md border-b border-dark-border transition-all duration-300 ${
          showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Back to Comic Detail */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href={`/komik/${comicSlug}`}
              className="p-2 rounded-xl bg-dark-card border border-dark-border text-gray-300 hover:text-brand transition shrink-0"
              title="Kembali ke Detail Komik"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-[140px] sm:max-w-xs md:max-w-md">
                {chapterData.series || comicDetail?.title || comicSlug}
              </h1>
              <p className="text-[10px] sm:text-[11px] font-bold text-brand truncate">
                Chapter {chapterData.chapter}
              </p>
            </div>
          </div>

          {/* Center Chapter Selector Dropdown */}
          {chaptersList.length > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={chapterSlug}
                onChange={handleChapterSelect}
                className="bg-dark-card border border-dark-border rounded-xl px-3 py-1.5 text-xs font-bold text-gray-200 focus:outline-none focus:border-brand cursor-pointer max-w-[200px]"
              >
                {chaptersList.map((ch) => {
                  const s = extractSlugFromUrl(ch.url);
                  return (
                    <option key={ch.url} value={s}>
                      {ch.title}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl bg-dark-card border border-dark-border text-gray-300 hover:text-brand transition"
              title="Pengaturan Membaca"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <Link
              href="/"
              className="p-2 rounded-xl bg-dark-card border border-dark-border text-gray-300 hover:text-brand transition"
              title="Kembali ke Beranda"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Reading Progress Line */}
        <div className="w-full bg-dark-border h-0.5">
          <div
            className="bg-brand h-full transition-all duration-150"
            style={{ width: `${settings.mode === 'webtoon' ? progressPercent : ((currentPage + 1) / images.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Images Container */}
      <main
        className="mx-auto pt-16 sm:pt-20 transition-all duration-300 px-1 sm:px-4"
        style={{
          maxWidth: `${settings.maxWidth}px`,
          filter: `${settings.invert ? 'invert(1) hue-rotate(180deg)' : ''} brightness(${settings.brightness}%)`,
        }}
        onClick={() => setShowControls((prev) => !prev)}
      >
        {/* Webtoon Mode */}
        {settings.mode === 'webtoon' ? (
          <div className="space-y-0 flex flex-col items-center">
            {images.map((imgUrl, idx) => (
              <div
                key={`${imgUrl}-${idx}`}
                className="w-full relative min-h-[150px] flex items-center justify-center bg-dark-surface/20"
              >
                <img
                  src={imgUrl}
                  alt={`Halaman ${idx + 1}`}
                  className="reader-image w-full object-contain"
                  referrerPolicy="no-referrer"
                  loading={idx < 4 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Single Page Mode */
          <div className="flex flex-col items-center justify-center min-h-[70vh] relative">
            {images[currentPage] ? (
              <img
                src={images[currentPage]}
                alt={`Halaman ${currentPage + 1}`}
                className="reader-image max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center py-20 text-dark-muted text-xs">
                Tidak ada halaman gambar.
              </div>
            )}

            {/* Single page navigation buttons */}
            <div className="flex items-center justify-between w-full max-w-lg mt-6 gap-3">
              <button
                type="button"
                disabled={currentPage === 0 && !prevChapter}
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentPage > 0) setCurrentPage((p) => p - 1);
                  else handlePrevChapter();
                }}
                className="px-3.5 py-2 rounded-xl bg-dark-card border border-dark-border text-xs font-bold text-gray-200 hover:text-brand transition disabled:opacity-30"
              >
                Sebelumnya
              </button>

              <span className="text-xs font-bold text-brand bg-dark-surface px-3 py-1 rounded-full border border-dark-border">
                {currentPage + 1} / {images.length}
              </span>

              <button
                type="button"
                disabled={currentPage === images.length - 1 && !nextChapter}
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentPage < images.length - 1) setCurrentPage((p) => p + 1);
                  else handleNextChapter();
                }}
                className="px-3.5 py-2 rounded-xl bg-dark-card border border-dark-border text-xs font-bold text-gray-200 hover:text-brand transition disabled:opacity-30"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}

        {/* End-of-Chapter Section - Clean without arrow buttons */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-dark-card border border-dark-border text-center space-y-4 max-w-md mx-auto shadow-2xl">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Selesai Chapter {chapterData.chapter}
            </h3>
            <p className="text-xs text-dark-muted mt-0.5">
              {nextChapter
                ? 'Lanjutkan ke chapter berikutnya'
                : 'Ini adalah chapter terbaru saat ini.'}
            </p>
          </div>

          <div className="pt-1">
            {nextChapter ? (
              <button
                type="button"
                onClick={handleNextChapter}
                className="w-full py-3 rounded-xl bg-brand text-black font-black text-xs sm:text-sm hover:bg-yellow-400 transition active:scale-95 shadow-glow-gold"
              >
                Lanjut Chapter Berikutnya
              </button>
            ) : (
              <Link
                href={`/komik/${comicSlug}`}
                className="w-full py-3 rounded-xl bg-brand text-black font-black text-xs sm:text-sm inline-block hover:bg-yellow-400 transition"
              >
                Kembali ke Detail Komik
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Floating Bottom Navigation Bar (No Autoscroll Button) */}
      <footer
        className={`fixed bottom-3 inset-x-0 z-40 max-w-md mx-auto px-3 transition-all duration-300 ${
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="p-2 rounded-2xl bg-dark-surface/95 backdrop-blur-xl border border-dark-border shadow-2xl flex items-center justify-between gap-2">
          {/* Prev Chapter */}
          <button
            type="button"
            disabled={!prevChapter}
            onClick={handlePrevChapter}
            className="px-3 py-2 rounded-xl bg-dark-card border border-dark-border text-xs font-bold text-gray-200 hover:text-brand transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev Chapter
          </button>

          {/* Mode Switcher */}
          <button
            type="button"
            onClick={() =>
              updateSettings({ mode: settings.mode === 'webtoon' ? 'single' : 'webtoon' })
            }
            className="px-3.5 py-2 rounded-xl bg-dark-card border border-brand/40 text-xs font-bold text-brand hover:border-brand transition"
          >
            {settings.mode === 'webtoon' ? 'Mode: Webtoon' : 'Mode: Single Page'}
          </button>

          {/* Next Chapter */}
          <button
            type="button"
            disabled={!nextChapter}
            onClick={handleNextChapter}
            className="px-3 py-2 rounded-xl bg-brand text-black font-bold text-xs hover:bg-yellow-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next Chapter
          </button>
        </div>
      </footer>

      {/* Mobile-Responsive Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm sm:max-w-md bg-dark-card border border-dark-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-dark-border">
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand" />
                  Pengaturan Membaca
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 rounded-lg text-dark-muted hover:text-white hover:bg-dark-surface transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Switcher */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 block">
                  Mode Tampilan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateSettings({ mode: 'webtoon' })}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition text-center ${
                      settings.mode === 'webtoon'
                        ? 'bg-brand text-black border-brand'
                        : 'bg-dark-surface border-dark-border text-gray-300'
                    }`}
                  >
                    Scroll Vertikal
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSettings({ mode: 'single' })}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition text-center ${
                      settings.mode === 'single'
                        ? 'bg-brand text-black border-brand'
                        : 'bg-dark-surface border-dark-border text-gray-300'
                    }`}
                  >
                    Single Page
                  </button>
                </div>
              </div>

              {/* Container Width Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span>Lebar Halaman</span>
                  <span className="text-brand">{settings.maxWidth}px</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="1400"
                  step="50"
                  value={settings.maxWidth}
                  onChange={(e) => updateSettings({ maxWidth: Number(e.target.value) })}
                  className="w-full accent-brand cursor-pointer"
                />
              </div>

              {/* Brightness Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span>Kecerahan</span>
                  <span className="text-brand">{settings.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={settings.brightness}
                  onChange={(e) => updateSettings({ brightness: Number(e.target.value) })}
                  className="w-full accent-brand cursor-pointer"
                />
              </div>

              {/* Invert Colors Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-gray-300">Invert Warna Layar</span>
                <button
                  type="button"
                  onClick={() => updateSettings({ invert: !settings.invert })}
                  className={`w-11 h-6 rounded-full transition p-0.5 flex items-center ${
                    settings.invert ? 'bg-brand justify-end' : 'bg-dark-surface border border-dark-border justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 rounded-xl bg-brand text-black font-black text-xs sm:text-sm hover:bg-yellow-400 transition"
              >
                Tutup Pengaturan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
