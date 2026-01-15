'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, User, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { MobileNav } from './mobile-nav'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/products', label: 'Ürünler' },
  { href: '/products?category=kartvizit', label: 'Kartvizit' },
  { href: '/products?category=brosur', label: 'Broşür' },
  { href: '/products?category=afis', label: 'Afiş' },
]

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const { isAuthenticated, user } = useAuthStore()
  const isAdmin = useAuthStore((state) => state.isAdmin())

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Printer className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight">
            Justz<span className="text-primary">Matbaa</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Admin Link */}
          {isAdmin && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Admin Panel
              </Button>
            </Link>
          )}

          {/* User/Login */}
          {isAuthenticated ? (
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Giriş Yap
              </Button>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  variant="default"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
