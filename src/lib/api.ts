import {
  ComicHomeData,
  ComicDetail,
  ChapterDetail,
  PustakaResponse,
  GenreResponse,
  SearchResponse,
} from '@/types';
import { extractChapterSlug } from './utils';

const API_BASE = 'https://puruboy-api.vercel.app/api/komiku';

/**
 * Fetch Home page data (ranking mingguan & harian, terbaru, baru ditambahkan)
 */
export async function getHomeData(): Promise<ComicHomeData | null> {
  try {
    const res = await fetch(`${API_BASE}/home`, {
      next: { revalidate: 300 }, // 5 minutes cache
      headers: {
        'User-Agent': 'RuangKomik-App',
      },
    });
    if (!res.ok) {
      console.error(`Failed to fetch home: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching home data:', err);
    return null;
  }
}

/**
 * Fetch Comic Detail by slug
 */
export async function getComicDetail(slug: string): Promise<ComicDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/detail?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
      headers: {
        'User-Agent': 'RuangKomik-App',
      },
    });
    if (!res.ok) {
      console.error(`Failed to fetch detail for ${slug}: ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (!data || !data.success) return null;

    // If detail does not have a direct cover, fetch first chapter thumbnail
    if (!data.cover) {
      if (data.thumbnail) {
        data.cover = data.thumbnail;
      } else if (data.chapters?.first?.url || data.chapters?.latest?.url) {
        try {
          const targetUrl = data.chapters?.first?.url || data.chapters?.latest?.url;
          const chSlug = extractChapterSlug(targetUrl);
          const chRes = await fetch(`${API_BASE}/chapter?url=${encodeURIComponent(chSlug)}`, {
            next: { revalidate: 86400 },
            headers: { 'User-Agent': 'RuangKomik-App' },
          });
          if (chRes.ok) {
            const chData = await chRes.json();
            if (chData && chData.thumbnail) {
              data.cover = chData.thumbnail;
            }
          }
        } catch (e) {
          // silently fallback
        }
      }
    }

    return data;
  } catch (err) {
    console.error(`Error fetching comic detail for ${slug}:`, err);
    return null;
  }
}

/**
 * Fetch Chapter reader data by URL or slug
 */
export async function getChapterData(urlOrSlug: string): Promise<ChapterDetail | null> {
  try {
    const cleanUrl = extractChapterSlug(urlOrSlug);
    const res = await fetch(`${API_BASE}/chapter?url=${encodeURIComponent(cleanUrl)}`, {
      next: { revalidate: 600 },
      headers: {
        'User-Agent': 'RuangKomik-App',
      },
    });
    if (!res.ok) {
      console.error(`Failed to fetch chapter ${cleanUrl}: ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (!data || !data.success) return null;
    return data;
  } catch (err) {
    console.error(`Error fetching chapter data for ${urlOrSlug}:`, err);
    return null;
  }
}

/**
 * Fetch Pustaka catalog by type and page
 * @param tipe manga | manhwa | manhua
 * @param page number
 */
export async function getPustaka(tipe: string = 'manhwa', page: number = 1): Promise<PustakaResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/pustaka?tipe=${encodeURIComponent(tipe)}&page=${page}`, {
      next: { revalidate: 300 },
      headers: {
        'User-Agent': 'RuangKomik-App',
      },
    });
    if (!res.ok) {
      console.error(`Failed to fetch pustaka: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching pustaka:', err);
    return null;
  }
}

/**
 * Fetch comics by genre and page
 */
export async function getGenreData(genre: string = 'action', page: number = 1): Promise<GenreResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/genre?genre=${encodeURIComponent(genre)}&page=${page}`, {
      next: { revalidate: 300 },
      headers: {
        'User-Agent': 'RuangKomik-App',
      },
    });
    if (!res.ok) {
      console.error(`Failed to fetch genre ${genre}: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error fetching genre data for ${genre}:`, err);
    return null;
  }
}

/**
 * Search comics by keyword
 */
export async function searchComics(query: string, page: number = 1): Promise<SearchResponse | null> {
  if (!query || !query.trim()) {
    return {
      success: true,
      source: 'komiku.org',
      query: '',
      page: 1,
      hasNext: false,
      results: [],
    };
  }
  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&page=${page}`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'RuangKomik-App',
      },
    });
    if (!res.ok) {
      console.error(`Failed to search comics for "${query}": ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error searching comics for "${query}":`, err);
    return null;
  }
}
