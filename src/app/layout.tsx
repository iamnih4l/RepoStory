import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RepoStory — Turn Any GitHub Repository Into an Interactive Learning Experience',
  description:
    'Turn complex GitHub repositories into interactive, animated, picture-book-style visual stories. Discover what they do, explore key concepts, and learn how to run them.',
  keywords: ['github', 'learning', 'open source', 'visual story', 'code explanation', 'ai', 'rag'],
  authors: [{ name: 'RepoStory' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#070A11] text-slate-100 font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
