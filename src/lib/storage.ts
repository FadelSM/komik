'use client';

import { BookmarkItem, HistoryItem, ReaderSettings } from '@/types';

const BOOKMARKS_KEY = 'komikverse_bookmarks';
const HISTORY_KEY = 'komikverse_history';
const SETTINGS_KEY = 'komikverse_reader_settings';

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  mode: 'webtoon',
  maxWidth: 900,
  brightness: 100,
  invert: false,
  autoScrollSpeed: 0,
};

// Safe browser check
const isClient = typeof window !== 'undefined';

// --- BOOKMARKS ---
export function getBookmarks(): BookmarkItem[] {
  if (!isClient) return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading bookmarks', e);
    return [];
  }
}

export function isBookmarked(slug: string): boolean {
  if (!isClient) return false;
  const list = getBookmarks();
  return list.some((item) => item.slug === slug);
}

export function toggleBookmark(item: Omit<BookmarkItem, 'addedAt'>): boolean {
  if (!isClient) return false;
  try {
    const current = getBookmarks();
    const index = current.findIndex((b) => b.slug === item.slug);
    let updated: BookmarkItem[];
    let isAdded = false;

    if (index >= 0) {
      updated = current.filter((b) => b.slug !== item.slug);
      isAdded = false;
    } else {
      updated = [{ ...item, addedAt: Date.now() }, ...current];
      isAdded = true;
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('bookmarks_updated'));
    return isAdded;
  } catch (e) {
    console.error('Error toggling bookmark', e);
    return false;
  }
}

export function removeBookmark(slug: string): void {
  if (!isClient) return;
  try {
    const current = getBookmarks();
    const updated = current.filter((b) => b.slug !== slug);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('bookmarks_updated'));
  } catch (e) {
    console.error('Error removing bookmark', e);
  }
}

// --- HISTORY ---
export function getHistory(): HistoryItem[] {
  if (!isClient) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading history', e);
    return [];
  }
}

export function saveHistory(item: Omit<HistoryItem, 'readAt'>): void {
  if (!isClient) return;
  try {
    const current = getHistory();
    const filtered = current.filter((h) => h.slug !== item.slug);
    const updated: HistoryItem[] = [
      {
        ...item,
        readAt: Date.now(),
      },
      ...filtered,
    ].slice(0, 100); // keep max 100

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('history_updated'));
  } catch (e) {
    console.error('Error saving history', e);
  }
}

export function removeHistoryItem(slug: string): void {
  if (!isClient) return;
  try {
    const current = getHistory();
    const updated = current.filter((h) => h.slug !== slug);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('history_updated'));
  } catch (e) {
    console.error('Error removing history item', e);
  }
}

export function clearHistory(): void {
  if (!isClient) return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new Event('history_updated'));
  } catch (e) {
    console.error('Error clearing history', e);
  }
}

// --- SETTINGS ---
export function getReaderSettings(): ReaderSettings {
  if (!isClient) return DEFAULT_READER_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_READER_SETTINGS, ...JSON.parse(raw) } : DEFAULT_READER_SETTINGS;
  } catch (e) {
    return DEFAULT_READER_SETTINGS;
  }
}

export function saveReaderSettings(settings: Partial<ReaderSettings>): ReaderSettings {
  if (!isClient) return DEFAULT_READER_SETTINGS;
  try {
    const current = getReaderSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return DEFAULT_READER_SETTINGS;
  }
}
