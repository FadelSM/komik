// Types for Ruang Komik

export interface ComicHomeRankingItem {
  rank: number;
  slug: string;
  title: string;
  cover: string;
  meta: string;
  latestChapter: string;
  url: string;
}

export interface ComicHomeTerbaruItem {
  rank: number | null;
  slug: string;
  title: string;
  cover: string;
  meta: string;
  latestChapter: string;
  url: string;
}

export interface ComicHomeData {
  success: boolean;
  source: string;
  ranking: {
    mingguan: ComicHomeRankingItem[];
    harian: ComicHomeRankingItem[];
  };
  populer: ComicHomeTerbaruItem[];
  terbaru: ComicHomeTerbaruItem[];
  baruDitambahkan: ComicHomeTerbaruItem[];
}

export interface GenreItem {
  slug: string;
  name: string;
}

export interface ChapterInfo {
  url: string;
  title: string;
  date?: string;
}

export interface ComicDetail {
  success: boolean;
  source: string;
  id: string;
  slug: string;
  title: string;
  cover?: string;
  thumbnail?: string;
  alternativeTitle?: string;
  type: string; // Manga, Manhwa, Manhua
  theme?: string;
  genre: GenreItem[];
  author?: string;
  rating?: string;
  readers?: string | null;
  readingDirection?: string;
  synopsis: string;
  chapters: {
    count: number;
    first: {
      title: string;
      url: string;
    };
    latest: {
      title: string;
      url: string;
    };
    list: ChapterInfo[];
  };
  related: {
    slug: string;
    title: string;
    url: string;
  }[];
  url: string;
}

export interface ChapterDetail {
  success: boolean;
  source: string;
  id: number;
  seriesId: number;
  series: string;
  chapter: string;
  imageCount: number;
  thumbnail: string;
  hasNext: boolean;
  seriesUrl: string;
  images: string[];
  url: string;
  prevChapter?: string;
  nextChapter?: string;
}

export interface PustakaItem {
  slug: string;
  title: string;
  cover: string;
  type: string;
  theme?: string;
  readers?: string | null;
  synopsis: string;
  url: string;
  chapters?: {
    first?: { title: string; url: string };
    latest?: { title: string; url: string };
  };
}

export interface PustakaResponse {
  success: boolean;
  source: string;
  tipe?: string;
  page: number;
  hasNext: boolean;
  results: PustakaItem[];
}

export interface GenreResponse {
  success: boolean;
  source: string;
  genre: string;
  page: number;
  hasNext: boolean;
  genres: GenreItem[];
  results: PustakaItem[];
}

export interface SearchResponse {
  success: boolean;
  source: string;
  query: string;
  page: number;
  hasNext: boolean;
  results: PustakaItem[];
}

export interface BookmarkItem {
  slug: string;
  title: string;
  cover: string;
  type: string;
  latestChapter?: string;
  addedAt: number;
}

export interface HistoryItem {
  slug: string;
  title: string;
  cover: string;
  type?: string;
  chapterSlug: string;
  chapterTitle: string;
  readAt: number;
  progressPercent?: number;
}

export interface ReaderSettings {
  mode: 'webtoon' | 'single';
  maxWidth: number; // e.g. 800, 1000, 1200, 1600
  brightness: number; // 50 - 150
  invert: boolean;
  autoScrollSpeed: number; // 0 = off, 1-5
}
