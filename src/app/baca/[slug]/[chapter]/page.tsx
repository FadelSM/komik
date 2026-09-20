import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getChapterData, getComicDetail } from '@/lib/api';
import ReaderEngine from '@/components/ReaderEngine';

interface ChapterPageProps {
  params: {
    slug: string;
    chapter: string;
  };
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const chapterData = await getChapterData(params.chapter);
  if (!chapterData) {
    return {
      title: 'Chapter Tidak Ditemukan - Komik Verse',
    };
  }
  return {
    title: `Baca ${chapterData.series} Chapter ${chapterData.chapter} Bahasa Indonesia - Komik Verse`,
    description: `Baca komik ${chapterData.series} Chapter ${chapterData.chapter} online gratis di Komik Verse. Update gambar jernih dan loading cepat.`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const [chapterData, comicDetail] = await Promise.all([
    getChapterData(params.chapter),
    getComicDetail(params.slug),
  ]);

  if (!chapterData || !chapterData.images || chapterData.images.length === 0) {
    notFound();
  }

  return (
    <ReaderEngine
      chapterData={chapterData}
      comicDetail={comicDetail}
      comicSlug={params.slug}
      chapterSlug={params.chapter}
    />
  );
}
