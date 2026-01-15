'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useProductStore } from '@/stores/product-store'
import { useLanguageStore } from '@/stores/language-store'
import { ProductCard } from '@/components/products/product-card'
import { ProductListItem } from '@/components/products/product-list-item'
import { CategoryFilter } from '@/components/products/category-filter'
import { ViewToggle } from '@/components/products/view-toggle'
import { ProductGridSkeleton } from '@/components/ui/product-skeleton'
import { EmptyProducts } from '@/components/ui/empty-state'
import { getCategoryName } from '@/lib/utils'
import type { ProductCategory } from '@/types'

function ProductsContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') as ProductCategory | null
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const { t } = useLanguageStore()
  
  const { products, isLoading, fetchProducts, getProductsByCategory } = useProductStore()

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
  }, [products.length, fetchProducts])

  const filteredProducts = category 
    ? getProductsByCategory(category)
    : products

  const pageTitle = category 
    ? `${getCategoryName(category)} ${t.products.title}`
    : t.products.all

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} {t.cart.items}
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <CategoryFilter currentCategory={category || undefined} />
        <ViewToggle view={view} onViewChange={setView} />
      </motion.div>

      {/* Products */}
      {isLoading ? (
        <ProductGridSkeleton count={6} />
      ) : filteredProducts.length === 0 ? (
        <EmptyProducts />
      ) : view === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductListItem product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={6} />}>
      <ProductsContent />
    </Suspense>
  )
}
