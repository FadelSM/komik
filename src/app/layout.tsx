import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import LenisProvider from '@/components/LenisProvider';
import MainLayout from '@/components/MainLayout';
import PWARegister from '@/components/PWARegister';
import AntiDevTools from '@/components/AntiDevTools';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#07080B',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kuzuroken.site'),
  title: 'Komik Verse - Baca Komik, Manhwa, Manga & Manhua Bahasa Indonesia',
  description:
    'Komik Verse adalah platform baca manga, manhwa, dan manhua gratis berbahasa Indonesia terlengkap dan terupdate. Nikmati pengalaman membaca komik berkualitas tinggi tanpa jeda.',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Komik Verse - Read More Worlds',
    description: 'Platform baca komik, manga, manhwa, dan manhua bahasa Indonesia terbaik.',
    images: ['/images/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} dark`}>
      <body className="font-sans min-h-screen flex flex-col bg-dark-void text-gray-100 pb-20 md:pb-8">
        <AntiDevTools />
        <LenisProvider>
          <PWARegister />
          <Navbar />
          <MainLayout>{children}</MainLayout>
        </LenisProvider>
      </body>
    </html>
  );
}
