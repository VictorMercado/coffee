import React from "react";
import type { Metadata } from 'next';
import { Space_Grotesk, Orbitron } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/components/providers/auth-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { SettingsProvider } from '@/components/providers/settings-provider';
import './globals.css';

const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const _orbitron = Orbitron({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ORBIT COFFEE - Retro Futuristic Brews',
  description: 'Experience coffee from the future. Premium brews crafted with atomic precision.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </AuthProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
