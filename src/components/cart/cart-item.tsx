'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/stores/cart-store'
import { formatPrice, getOptionName } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore()
  const { product, selectedOptions, calculatedPrice } = item

  const sizeName = getOptionName(product.printOptions.sizes, selectedOptions.sizeId)
  const paperName = getOptionName(product.printOptions.paperTypes, selectedOptions.paperTypeId)
  const sideName = getOptionName(product.printOptions.printSides, selectedOptions.printSideId)

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantities = product.printOptions.quantities
    const closestQuantity = validQuantities.reduce((prev, curr) => 
      Math.abs(curr - newQuantity) < Math.abs(prev - newQuantity) ? curr : prev
    )
    updateQuantity(item.id, closestQuantity)
  }

  const currentIndex = product.printOptions.quantities.indexOf(selectedOptions.quantity)
  const canDecrease = currentIndex > 0
  const canIncrease = currentIndex < product.printOptions.quantities.length - 1

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <Link href={`/products/${product.slug}`} className="shrink-0">
            <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  Görsel yok
                </div>
              )}
            </div>
          </Link>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            
            <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
              <p>Boyut: {sizeName}</p>
              <p>Kağıt: {paperName}</p>
              <p>Baskı: {sideName}</p>
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="flex flex-col items-end justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="text-right">
              <p className="font-bold text-primary">{formatPrice(calculatedPrice)}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!canDecrease}
                  onClick={() => {
                    if (canDecrease) {
                      handleQuantityChange(product.printOptions.quantities[currentIndex - 1])
                    }
                  }}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-16 text-center text-sm font-medium">
                  {selectedOptions.quantity} adet
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!canIncrease}
                  onClick={() => {
                    if (canIncrease) {
                      handleQuantityChange(product.printOptions.quantities[currentIndex + 1])
                    }
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
