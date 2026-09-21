import { NextRequest, NextResponse } from 'next/server';
import { extractChapterSlug } from '@/lib/utils';

const API_BASE = 'https://puruboy-api.vercel.app/api/komiku';

export const dynamic = 'force-dynamic';

// Server-side in-memory cover cache
const memoryCoverCache: Record<string, string> = {};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ success: false, cover: null }, { status: 400 });
  }

  // Return from memory cache if available
  if (memoryCoverCache[slug]) {
    return NextResponse.json(
      { success: true, cover: memoryCoverCache[slug] },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } }
    );
  }

  try {
    const detailRes = await fetch(`${API_BASE}/detail?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 86400 },
      headers: {
        'User-Agent': 'RuangKomik-App',
      },
    });

    if (detailRes.ok) {
      const data = await detailRes.json();
      if (data && data.cover) {
        memoryCoverCache[slug] = data.cover;
        return NextResponse.json(
          { success: true, cover: data.cover },
          { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } }
        );
      }

      const targetUrl = data?.chapters?.first?.url || data?.chapters?.latest?.url;
      if (targetUrl) {
        const chSlug = extractChapterSlug(targetUrl);
        const chRes = await fetch(`${API_BASE}/chapter?url=${encodeURIComponent(chSlug)}`, {
          next: { revalidate: 86400 },
          headers: { 'User-Agent': 'RuangKomik-App' },
        });

        if (chRes.ok) {
          const chData = await chRes.json();
          if (chData && chData.thumbnail) {
            memoryCoverCache[slug] = chData.thumbnail;
            return NextResponse.json(
              { success: true, cover: chData.thumbnail },
              { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } }
            );
          }
        }
      }
    }
  } catch (e) {
    console.error(`Error in /api/comic-cover for ${slug}:`, e);
  }

  return NextResponse.json(
    { success: false, cover: null },
    { headers: { 'Cache-Control': 'public, s-maxage=3600' } }
  );
}
