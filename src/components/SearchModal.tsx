'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, BookOpen } from 'lucide-react';
import { searchComics } from '@/lib/api';
import { PustakaItem } from '@/types';
import { getTypeBadgeStyle } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PustakaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Global shortcut (Cmd/Ctrl + K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or custom event
          const event = new CustomEvent('open-search-modal');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchComics(query.trim());
      if (res && res.results) {
        setResults(res.results.slice(0, 8)); // Top 8 suggestions
      } else {
        setResults([]);
      }
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (slug: string) => {
    onClose();
    router.push(`/komik/${slug}`);
  };

  const popularSearches = ['Solo Leveling', 'Magic Emperor', 'Nano Machine', 'Martial Peak', 'Return of the Mount Hua Sect', 'Jujutsu Kaisen'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/80 backdrop-blur-md">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-2xl bg-dark-surface border-2 border-dark-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSubmit} className="relative flex items-center px-4 py-3.5 border-b border-dark-border bg-dark-card/50">
              <Search className="w-5 h-5 text-brand shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul komik, manga, manhwa, manhua..."
                className="w-full bg-transparent text-gray-100 placeholder-dark-muted focus:outline-none text-base sm:text-lg"
              />
              {loading && <Loader2 className="w-5 h-5 text-brand animate-spin shrink-0 mx-2" />}
              {query && !loading && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-dark-muted hover:text-white hover:bg-dark-border transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="ml-2 px-2 py-1 text-xs font-semibold bg-dark-border rounded text-dark-muted hover:text-white transition"
              >
                ESC
              </button>
            </form>

            {/* Results & Suggestions Area */}
            <div className="overflow-y-auto p-4 flex-1 divide-y divide-dark-border/40">
              {query.trim() === '' ? (
                <div>
                  <div className="text-xs font-bold text-dark-muted uppercase tracking-wider mb-3">
                    Pencarian Populer
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border hover:border-brand hover:text-brand transition text-gray-300"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-dark-muted pb-2">
                    <span>Hasil untuk &quot;{query}&quot;</span>
                    <button
                      onClick={handleSubmit}
                      className="text-brand hover:underline font-bold text-xs"
                    >
                      Lihat Semua Hasil
                    </button>
                  </div>
                  <div className="space-y-1">
                    {results.map((item) => {
                      const badge = getTypeBadgeStyle(item.type);
                      return (
                        <div
                          key={item.slug}
                          onClick={() => handleSelect(item.slug)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-dark-card-hover border border-transparent hover:border-dark-border cursor-pointer transition group"
                        >
                          <div className="relative w-12 h-16 shrink-0 rounded-lg overflow-hidden bg-dark-card border border-dark-border">
                            {item.cover ? (
                              <img
                                src={item.cover}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-dark-muted">
                                <BookOpen className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                                {item.type || 'Komik'}
                              </span>
                              {item.theme && (
                                <span className="text-[10px] text-dark-muted">{item.theme}</span>
                              )}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-100 group-hover:text-brand truncate mt-0.5">
                              {item.title}
                            </h4>
                            <p className="text-xs text-dark-muted line-clamp-1 mt-0.5">
                              {item.synopsis || 'Klik untuk membaca detail komik...'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : !loading ? (
                <div className="py-8 text-center text-dark-muted">
                  <p className="text-sm">Tidak menemukan komik dengan judul &quot;{query}&quot;</p>
                  <p className="text-xs mt-1 text-gray-500">Coba kata kunci lain seperti manga, manhwa, atau judul lainnya.</p>
                </div>
              ) : null}
            </div>

            {/* Footer hint */}
            <div className="p-3 bg-dark-bg/80 border-t border-dark-border text-center text-xs text-dark-muted flex items-center justify-between px-4">
              <span>Tekan <kbd className="px-1.5 py-0.5 bg-dark-card border border-dark-border rounded text-[10px]">Enter</kbd> untuk hasil lengkap</span>
              <span><span className="text-brand font-semibold">KOMIK VERSE</span> Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
