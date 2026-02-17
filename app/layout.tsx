import React from "react";
import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Orbitron } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/components/providers/auth-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { SettingsProvider } from '@/components/providers/settings-provider';
import './globals.css';
import { Toaster } from "sonner";

const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const _orbitron = Orbitron({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'ORBIT COFFEE - Retro Futuristic Brews',
  description: 'Experience coffee from the future. Premium brews crafted with atomic precision.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Orbit Coffee',
  },
  icons: {
    icon: [
      {
        url: '/icon-1024x1024.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-1024x1024.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon-1024x1024.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon-1024x1024.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <body className="font-sans antialiased overscroll-y-none">
        <Toaster toastOptions={{
          className: "!font-mono !bg-background !text-primary !rounded-none !border !border-border",
          duration: 5000,
        }} position="top-center" />
        <QueryProvider>
          <AuthProvider>
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </AuthProvider>
        </QueryProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
