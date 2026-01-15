'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getCategoryName } from '@/lib/utils'
import { useLanguageStore } from '@/stores/language-store'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguageStore()
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group h-full overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span>{t.products.noProducts}</span>
              </div>
            )}
            {product.featured && (
              <Badge className="absolute top-2 left-2" variant="secondary">
                {t.admin.featured}
              </Badge>
            )}
          </div>
        </Link>

        <CardContent className="p-4">
          <Link href={`/products/${product.slug}`}>
            <Badge variant="outline" className="mb-2 text-xs">
              {getCategoryName(product.category)}
            </Badge>
            <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.shortDescription}
            </p>
          </Link>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            <span className="text-xs text-muted-foreground">{t.products.from}</span>
            <p className="font-bold text-primary">
              {formatPrice(product.basePrice)}
            </p>
          </div>
          <Link href={`/products/${product.slug}`}>
            <Button size="sm" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              {t.products.viewDetails}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
