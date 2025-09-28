import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'FloatChat - AI-Powered Ocean Data Discovery',
  description: 'Conversational interface for ARGO oceanographic dataset exploration and visualization',
  keywords: 'oceanography, ARGO, data visualization, AI, chat interface, marine science',
  authors: [{ name: 'FloatChat Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans h-full antialiased bg-slate-900`}>
        <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}