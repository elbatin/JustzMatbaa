'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, CreditCard, FileText, Image, Sparkles, LogIn, LogOut, LayoutDashboard, Moon, Sun, Languages } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuthStore } from '@/stores/auth-store'
import { useLanguageStore } from '@/stores/language-store'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()
  const { isAuthenticated: storeIsAuthenticated, user, logout } = useAuthStore()
  const storeIsAdmin = useAuthStore((state) => state.isAdmin())
  const { locale, toggleLocale, t } = useLanguageStore()
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Use safe defaults during SSR
  const isAuthenticated = mounted ? storeIsAuthenticated : false
  const isAdmin = mounted ? storeIsAdmin : false
  const safeT = mounted ? t : translations.tr
  const safeTheme = mounted ? theme : 'light'
  const safeLocale = mounted ? locale : 'tr'

  const navItems = [
    { href: '/', label: safeT.nav.home, icon: Home },
    { href: '/products', label: safeT.nav.products, icon: Package },
    { href: '/products?category=kartvizit', label: safeT.nav.businessCard, icon: CreditCard },
    { href: '/products?category=brosur', label: safeT.nav.brochure, icon: FileText },
    { href: '/products?category=afis', label: safeT.nav.poster, icon: Image },
    { href: '/products?category=katalog', label: safeT.categories.catalog, icon: FileText },
    { href: '/products?category=ozel-baski', label: safeT.categories.flyer, icon: Sparkles },
  ]

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

      {/* Theme & Language */}
      <div className="flex gap-2 mb-4">
        <Button 
          variant="outline" 
          className="flex-1 justify-start gap-2"
          onClick={() => setTheme(safeTheme === 'dark' ? 'light' : 'dark')}
        >
          {safeTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {safeTheme === 'dark' ? safeT.theme.dark : safeT.theme.light}
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 justify-start gap-2"
          onClick={toggleLocale}
        >
          <Languages className="h-4 w-4" />
          {safeLocale === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
        </Button>
      </div>

      <Separator className="my-4" />

      {/* Auth Section */}
      <div className="space-y-2">
        {isAuthenticated ? (
          <>
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {safeLocale === 'tr' ? 'Hoş geldin' : 'Welcome'}, <span className="font-medium text-foreground">{user?.name}</span>
            </div>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <LayoutDashboard className="h-4 w-4" />
                  {safeT.nav.adminPanel}
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              {safeT.admin.logout}
            </Button>
          </>
        ) : (
          <Link href="/admin/login">
            <Button variant="outline" className="w-full justify-start gap-3">
              <LogIn className="h-4 w-4" />
              {safeT.nav.login}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
