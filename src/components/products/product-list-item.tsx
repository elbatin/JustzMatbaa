'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getCategoryName } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductListItemProps {
  product: Product
}

export function ProductListItem({ product }: ProductListItemProps) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <Link href={`/products/${product.slug}`} className="sm:w-48 shrink-0">
            <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-muted">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span>Görsel yok</span>
                </div>
              )}
              {product.featured && (
                <Badge className="absolute top-2 left-2" variant="secondary">
                  Öne Çıkan
                </Badge>
              )}
            </div>
          </Link>

          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1">
              <Badge variant="outline" className="mb-2 text-xs">
                {getCategoryName(product.category)}
              </Badge>
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">Başlangıç</span>
                <p className="font-bold text-lg text-primary">
                  {formatPrice(product.basePrice)}
                </p>
              </div>
              <Link href={`/products/${product.slug}`}>
                <Button className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  İncele
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
