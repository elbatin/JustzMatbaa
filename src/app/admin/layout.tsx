'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, FileText, LogOut, Printer, Menu } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Ürünler', icon: Package },
  { href: '/admin/orders', label: 'Siparişler', icon: FileText },
]

function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Logo */}
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Printer className="h-6 w-6 text-primary" />
          <span className="font-bold">Admin Panel</span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
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

      <Separator />

      {/* User Info & Logout */}
      <div className="p-4 space-y-2">
        <div className="px-3 py-2 text-sm">
          <p className="text-muted-foreground">Giriş yapan:</p>
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </Button>
        <Link href="/">
          <Button variant="outline" className="w-full">
            Siteye Dön
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const isAdminUser = isAdmin()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') return

    if (!isAuthenticated || !isAdminUser) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isAdminUser, pathname, router])

  // Show login page without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Don't render until auth is checked
  if (!isAuthenticated || !isAdminUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:border-r lg:bg-background">
        <AdminSidebar />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <Link href="/admin" className="flex items-center gap-2">
          <Printer className="h-5 w-5 text-primary" />
          <span className="font-bold">Admin</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
