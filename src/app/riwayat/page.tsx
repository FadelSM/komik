'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Trash2, Play, BookOpen, Clock, AlertTriangle, X } from 'lucide-react';
import { getHistory, clearHistory, removeHistoryItem } from '@/lib/storage';
import { HistoryItem } from '@/types';
import { getTypeBadgeStyle } from '@/lib/utils';

interface DeleteConfirmState {
  isOpen: boolean;
  type: 'all' | 'single';
  item?: HistoryItem;
}

export default function RiwayatPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [confirmModal, setConfirmModal] = useState<DeleteConfirmState>({
    isOpen: false,
    type: 'all',
  });

  useEffect(() => {
    setMounted(true);
    setHistory(getHistory());

    const handleUpdate = () => {
      setHistory(getHistory());
    };
    window.addEventListener('history_updated', handleUpdate);
    return () => window.removeEventListener('history_updated', handleUpdate);
  }, []);

  const openClearAllModal = () => {
    setConfirmModal({
      isOpen: true,
      type: 'all',
    });
  };

  const openSingleDeleteModal = (item: HistoryItem) => {
    setConfirmModal({
      isOpen: true,
      type: 'single',
      item,
    });
  };

  const closeModal = () => {
    setConfirmModal({
      isOpen: false,
      type: 'all',
    });
  };

  const handleConfirmDelete = () => {
    if (confirmModal.type === 'all') {
      clearHistory();
      setHistory([]);
    } else if (confirmModal.type === 'single' && confirmModal.item) {
      removeHistoryItem(confirmModal.item.slug);
      setHistory(getHistory());
    }
    closeModal();
  };

  return (
    <div className="space-y-5">
      {/* Compact Header Bar */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-dark-card border border-dark-border">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-white">
            Riwayat Bacaan
          </h1>
          <span className="text-[11px] text-dark-muted block mt-0.5">
            {mounted ? history.length : 0} Komik pernah dibaca
          </span>
        </div>

        {mounted && history.length > 0 && (
          <button
            type="button"
            onClick={openClearAllModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-surface border border-red-500/40 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition duration-150 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua</span>
          </button>
        )}
      </div>

      {/* History List */}
      {mounted && history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {history.map((item) => {
            const badge = getTypeBadgeStyle(item.type);
            const formattedDate = new Date(item.readAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={`${item.slug}-${item.chapterSlug}`}
                className="relative flex gap-3 p-3.5 rounded-2xl bg-dark-card border border-dark-border hover:border-brand/70 hover:bg-dark-card-hover transition duration-150 overflow-hidden shadow-sm group"
              >
                {/* Cover Thumbnail */}
                <div className="relative w-18 h-24 sm:w-20 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-dark-surface border border-dark-border">
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
                  {item.type && (
                    <span className={`absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {item.type}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-dark-muted">
                        <Clock className="w-3 h-3 text-brand/80" />
                        <span>{formattedDate}</span>
                      </div>

                      {/* Single Item Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          openSingleDeleteModal(item);
                        }}
                        className="p-1 rounded-md text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Hapus komik ini dari riwayat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-gray-100 group-hover:text-brand transition line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-xs font-bold text-brand mt-0.5 truncate">
                      {item.chapterTitle}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/baca/${item.slug}/${item.chapterSlug}`}
                      className="px-3 py-1.5 rounded-xl bg-brand text-black font-extrabold text-xs flex items-center gap-1 hover:bg-yellow-400 transition shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-black" />
                      Lanjut
                    </Link>
                    <Link
                      href={`/komik/${item.slug}`}
                      className="px-2.5 py-1.5 rounded-xl bg-dark-surface border border-dark-border text-xs font-semibold text-dark-muted hover:text-white transition"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-dark-muted bg-dark-card rounded-2xl border border-dark-border space-y-3">
          <div className="w-12 h-12 rounded-full bg-dark-surface border border-brand/40 flex items-center justify-center mx-auto text-brand">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-200">
            Belum ada riwayat bacaan
          </h3>
          <p className="text-xs max-w-sm mx-auto text-dark-muted">
            Komik yang kamu baca akan otomatis tersimpan di sini agar kamu bisa melanjutkannya kapan saja.
          </p>
          <div className="pt-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-black text-xs font-extrabold hover:bg-yellow-400 transition"
            >
              Mulai Baca Komik
            </Link>
          </div>
        </div>
      )}

      {/* Confirmation Modal: "Yakin Hapus atau Tidak" */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-dark-card border border-dark-border rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            {/* Icon & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {confirmModal.type === 'all'
                    ? 'Hapus Semua Riwayat?'
                    : 'Hapus Riwayat Komik?'}
                </h3>
                <span className="text-[11px] text-dark-muted block">
                  Konfirmasi Penghapusan
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-300 leading-relaxed">
              {confirmModal.type === 'all' ? (
                'Apakah kamu yakin ingin menghapus seluruh riwayat membaca? Data riwayat yang telah dihapus tidak dapat dipulihkan.'
              ) : (
                <span>
                  Apakah kamu yakin ingin menghapus riwayat bacaan{' '}
                  <strong className="text-white font-bold">
                    {confirmModal.item?.title}
                  </strong>{' '}
                  ({confirmModal.item?.chapterTitle})?
                </span>
              )}
            </p>

            {/* Actions: Batal vs Ya, Hapus */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="w-full py-2.5 px-4 rounded-xl bg-dark-surface border border-dark-border text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-900/30"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
