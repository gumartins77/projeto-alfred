import type { Metadata } from "next";
import PwaRegister from '@/components/PwaRegister';
import "./globals.css";

export const metadata: Metadata = {
  title: "Gerenciador de Relatórios",
  description: "Plataforma de gerenciamento de relatórios de manutenção",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gerenciador de Relatórios",
  },
  icons: {
    icon: "/icon-512.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="application-name" content="Relatórios" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Relatórios" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images-removebg-preview.png" sizes="192x192" />
        <link rel="icon" href="/images-removebg-preview.png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/images-removebg-preview.png" sizes="512x512" />
        <link rel="mask-icon" href="/images-removebg-preview.png" color="#3b82f6" />
      </head>
      <body>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {children}
          <PwaRegister />
        </div>
      </body>
    </html>
  );
}
