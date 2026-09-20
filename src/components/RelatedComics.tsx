'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface RelatedItem {
  title: string;
  slug: string;
}

interface RelatedComicsProps {
  related?: RelatedItem[];
}

// Client-side in-memory cache to avoid redundant network requests
const clientCoverCache: Record<string, string> = {};

// Helper to decode HTML entities (e.g. &#8217; -> ')
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function RelatedCard({ item }: { item: RelatedItem }) {
  const [cover, setCover] = useState<string | null>(clientCoverCache[item.slug] || null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (clientCoverCache[item.slug]) {
      setCover(clientCoverCache[item.slug]);
      return;
    }

    let isMounted = true;
    async function loadCover() {
      try {
        const res = await fetch(`/api/comic-cover?slug=${encodeURIComponent(item.slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.cover && isMounted) {
            clientCoverCache[item.slug] = data.cover;
            setCover(data.cover);
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    }

    loadCover();

    return () => {
      isMounted = false;
    };
  }, [item.slug]);

  const cleanTitle = decodeHtmlEntities(item.title);

  return (
    <Link
      href={`/komik/${item.slug}`}
      prefetch={true}
      className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-surface/40 hover:bg-dark-surface border border-dark-border/60 hover:border-brand/60 transition group"
    >
      {/* Cover Thumbnail */}
      <div className="relative w-14 h-18 sm:w-16 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-dark-card border border-dark-border flex items-center justify-center">
        {cover && !imgError ? (
          <img
            src={cover}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-dark-card text-dark-muted p-1 text-center">
            <BookOpen className="w-5 h-5 text-brand/60" />
            <span className="text-[8px] text-dark-muted mt-0.5 font-bold">Komik</span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:text-brand transition line-clamp-2 leading-snug">
          {cleanTitle}
        </h4>
        <span className="text-[10px] text-brand font-semibold block mt-1">
          Baca Komik
        </span>
      </div>
    </Link>
  );
}

export default function RelatedComics({ related }: RelatedComicsProps) {
  if (!related || related.length === 0) {
    return (
      <p className="text-xs text-dark-muted py-3 text-center">
        Tidak ada rekomendasi komik terkait.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {related.slice(0, 8).map((rel) => (
        <RelatedCard key={rel.slug} item={rel} />
      ))}
    </div>
  );
}
