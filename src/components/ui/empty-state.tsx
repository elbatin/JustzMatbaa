import { ReactNode } from 'react'
import { ShoppingCart, Package, FileText, Search, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-4 text-center",
      className
    )}>
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button>{action.label}</Button>
          </Link>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  )
}

export function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingCart className="h-16 w-16" />}
      title="Sepetiniz boş"
      description="Henüz sepetinize ürün eklemediniz. Ürünlerimize göz atarak alışverişe başlayabilirsiniz."
      action={{
        label: "Ürünlere Göz At",
        href: "/products"
      }}
    />
  )
}

export function EmptyProducts() {
  return (
    <EmptyState
      icon={<Package className="h-16 w-16" />}
      title="Ürün bulunamadı"
      description="Bu kategoride henüz ürün bulunmuyor. Diğer kategorilere göz atabilirsiniz."
      action={{
        label: "Tüm Ürünler",
        href: "/products"
      }}
    />
  )
}

export function EmptyOrders() {
  return (
    <EmptyState
      icon={<FileText className="h-16 w-16" />}
      title="Sipariş bulunamadı"
      description="Henüz hiç sipariş verilmemiş."
    />
  )
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="h-16 w-16" />}
      title="Sonuç bulunamadı"
      description={`"${query}" araması için sonuç bulunamadı. Farklı anahtar kelimeler deneyebilirsiniz.`}
      action={{
        label: "Tüm Ürünler",
        href: "/products"
      }}
    />
  )
}

export function NoAccess() {
  return (
    <EmptyState
      icon={<AlertCircle className="h-16 w-16" />}
      title="Erişim Engellendi"
      description="Bu sayfaya erişim yetkiniz bulunmuyor."
      action={{
        label: "Ana Sayfaya Dön",
        href: "/"
      }}
    />
  )
}
