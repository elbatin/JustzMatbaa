'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, CreditCard, FileText, Image, Sparkles, User, LogIn, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Ana Sayfa', icon: Home },
  { href: '/products', label: 'Tüm Ürünler', icon: Package },
  { href: '/products?category=kartvizit', label: 'Kartvizit', icon: CreditCard },
  { href: '/products?category=brosur', label: 'Broşür', icon: FileText },
  { href: '/products?category=afis', label: 'Afiş', icon: Image },
  { href: '/products?category=katalog', label: 'Katalog', icon: FileText },
  { href: '/products?category=ozel-baski', label: 'Özel Baskı', icon: Sparkles },
]

export function MobileNav() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuthStore()
  const isAdmin = useAuthStore((state) => state.isAdmin())

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="text-left">
        <SheetTitle className="text-xl font-bold">
          Justz<span className="text-primary">Matbaa</span>
        </SheetTitle>
      </SheetHeader>

      <Separator className="my-4" />

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]))
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-primary/10 text-primary'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <Separator className="my-4" />

      {/* Auth Section */}
      <div className="space-y-2">
        {isAuthenticated ? (
          <>
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Hoş geldin, <span className="font-medium text-foreground">{user?.name}</span>
            </div>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </Button>
          </>
        ) : (
          <Link href="/admin/login">
            <Button variant="outline" className="w-full justify-start gap-3">
              <LogIn className="h-4 w-4" />
              Giriş Yap
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
