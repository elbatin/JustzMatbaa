'use client'

import { ReactNode } from 'react'
import { ShoppingCart, Package, FileText, Search, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/stores/language-store'

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
  const { t } = useLanguageStore()
  return (
    <EmptyState
      icon={<ShoppingCart className="h-16 w-16" />}
      title={t.cart.empty}
      description={t.cart.emptyDescription}
      action={{
        label: t.cart.browseProducts,
        href: "/products"
      }}
    />
  )
}

export function EmptyProducts() {
  const { t } = useLanguageStore()
  return (
    <EmptyState
      icon={<Package className="h-16 w-16" />}
      title={t.products.noProducts}
      description={t.categories.subtitle}
      action={{
        label: t.products.all,
        href: "/products"
      }}
    />
  )
}

export function EmptyOrders() {
  const { t } = useLanguageStore()
  return (
    <EmptyState
      icon={<FileText className="h-16 w-16" />}
      title={t.admin.noOrders}
    />
  )
}

export function EmptySearch({ query }: { query: string }) {
  const { t } = useLanguageStore()
  return (
    <EmptyState
      icon={<Search className="h-16 w-16" />}
      title={t.common.noResults}
      description={`"${query}" ${t.common.noResults}`}
      action={{
        label: t.products.all,
        href: "/products"
      }}
    />
  )
}

export function NoAccess() {
  const { t } = useLanguageStore()
  return (
    <EmptyState
      icon={<AlertCircle className="h-16 w-16" />}
      title={t.common.error}
      action={{
        label: t.orderSuccess.backToHome,
        href: "/"
      }}
    />
  )
}
