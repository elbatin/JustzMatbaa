import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "JustzMatbaa - Profesyonel Baskı Çözümleri",
    template: "%s | JustzMatbaa"
  },
  description: "Kartvizit, broşür, afiş, katalog ve özel baskı ürünleri. Kaliteli malzeme, hızlı teslimat, uygun fiyat.",
  keywords: ["matbaa", "baskı", "kartvizit", "broşür", "afiş", "katalog", "özel baskı", "istanbul"],
  authors: [{ name: "JustzMatbaa" }],
  creator: "JustzMatbaa",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://justzmatbaa.com",
    siteName: "JustzMatbaa",
    title: "JustzMatbaa - Profesyonel Baskı Çözümleri",
    description: "Kartvizit, broşür, afiş, katalog ve özel baskı ürünleri. Kaliteli malzeme, hızlı teslimat, uygun fiyat.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JustzMatbaa - Profesyonel Baskı Çözümleri",
    description: "Kartvizit, broşür, afiş, katalog ve özel baskı ürünleri.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
