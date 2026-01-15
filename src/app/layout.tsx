import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';

export const metadata: Metadata = {
  title: '카카오 홈즈 - AI 인테리어',
  description: '초개인화 AI 인테리어 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <TabNavigation />
        <main className="mt-[136px] min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
