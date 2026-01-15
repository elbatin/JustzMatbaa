import Link from 'next/link'
import { Printer, Mail, Phone, MapPin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  products: [
    { href: '/products?category=kartvizit', label: 'Kartvizit' },
    { href: '/products?category=brosur', label: 'Broşür' },
    { href: '/products?category=afis', label: 'Afiş' },
    { href: '/products?category=katalog', label: 'Katalog' },
    { href: '/products?category=ozel-baski', label: 'Özel Baskı' },
  ],
  company: [
    { href: '/about', label: 'Hakkımızda' },
    { href: '/contact', label: 'İletişim' },
    { href: '/faq', label: 'SSS' },
    { href: '/terms', label: 'Kullanım Koşulları' },
    { href: '/privacy', label: 'Gizlilik Politikası' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Printer className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">
                Justz<span className="text-primary">Matbaa</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Profesyonel baskı çözümleri ile işinizi bir adım öne taşıyın. 
              Kaliteli malzeme, hızlı teslimat, uygun fiyat.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Ürünler</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                info@justzmatbaa.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                +90 (212) 555 00 00
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Matbaacılar Sitesi, İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 JustzMatbaa. Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu site portföy amaçlı demo projedir.
          </p>
        </div>
      </div>
    </footer>
  )
}
