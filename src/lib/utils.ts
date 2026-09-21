import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a clean slug from a chapter or comic URL
 */
export function extractSlugFromUrl(url: string): string {
  if (!url) return '';
  const cleaned = url.replace(/\/+$/, '');
  const parts = cleaned.split('/');
  return parts[parts.length - 1] || '';
}

/**
 * Normalizes a chapter identifier to a usable API url parameter
 */
export function extractChapterSlug(urlOrSlug: string): string {
  if (!urlOrSlug) return '';
  if (urlOrSlug.startsWith('http://') || urlOrSlug.startsWith('https://')) {
    return extractSlugFromUrl(urlOrSlug);
  }
  return urlOrSlug.replace(/\/+$/, '');
}

/**
 * Returns unified badge styling based on Ruang Komik logo color scheme
 */
export function getTypeBadgeStyle(type?: string): { bg: string; text: string; border: string; label: string } {
  return {
    bg: 'bg-dark-bg/90',
    text: 'text-brand',
    border: 'border-brand/40',
    label: type || 'Komik',
  };
}
