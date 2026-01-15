'use client'

import * as React from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, User, Printer, Sun, Moon, Languages } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { useLanguageStore } from '@/stores/language-store'
import { translations } from '@/lib/i18n'
import { MobileNav } from './mobile-nav'
import { motion } from 'framer-motion'

export function Header() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const { locale, toggleLocale } = useLanguageStore()
  
  const itemCount = useCartStore((state) => state.getItemCount())
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const storeIsAdmin = useAuthStore((state) => state.isAdmin())
  const t = useLanguageStore((state) => state.t)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  const isAuthenticated = mounted ? storeIsAuthenticated : false
  const isAdmin = mounted ? storeIsAdmin : false
  const safeT = mounted ? t : translations.tr
  const currentTheme = mounted ? theme : 'dark'
  const currentLocale = mounted ? locale : 'tr'

  const navLinks = [
    { href: '/', label: safeT.nav.home },
    { href: '/products', label: safeT.nav.products },
    { href: '/products?category=kartvizit', label: safeT.nav.businessCard },
    { href: '/products?category=brosur', label: safeT.nav.brochure },
    { href: '/products?category=afis', label: safeT.nav.poster },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Printer className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight">
            Justz<span className="text-primary">Matbaa</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}>
            {currentTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="sm" className="h-9 px-2 gap-1" onClick={toggleLocale}>
            <Languages className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">{currentLocale}</span>
          </Button>

          {isAdmin && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="hidden sm:flex">{safeT.nav.adminPanel}</Button>
            </Link>
          )}

          {isAuthenticated ? (
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9"><User className="h-4 w-4" /></Button>
            </Link>
          ) : (
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">{safeT.nav.login}</Button>
            </Link>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <ShoppingCart className="h-4 w-4" />
              {mounted && itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs" variant="default">{itemCount}</Badge>
              )}
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9"><Menu className="h-4 w-4" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]"><MobileNav /></SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
