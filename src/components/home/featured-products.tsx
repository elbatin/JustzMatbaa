'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProductStore } from '@/stores/product-store'
import { ProductCard } from '@/components/products/product-card'
import { ProductGridSkeleton } from '@/components/ui/product-skeleton'

export function FeaturedProducts() {
  const { products, isLoading, fetchProducts, getFeaturedProducts } = useProductStore()
  const featuredProducts = getFeaturedProducts()

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
  }, [products.length, fetchProducts])

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Öne Çıkan Ürünler</h2>
            <p className="text-muted-foreground">
              En çok tercih edilen baskı ürünlerimiz
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              Tümünü Gör
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
