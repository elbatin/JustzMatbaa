'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  basePrice: number
  quantity: number
}

export function PriceDisplay({ price, basePrice, quantity }: PriceDisplayProps) {
  const unitPrice = price / quantity

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-muted-foreground">Toplam:</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={price}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="text-3xl font-bold text-primary"
          >
            {formatPrice(price)}
          </motion.span>
        </AnimatePresence>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <span>Birim fiyat: </span>
        <span className="font-medium">{formatPrice(unitPrice)}</span>
        <span> / adet</span>
      </div>

      {quantity >= 500 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded"
        >
          <span>🎉</span>
          <span>Toplu alım indirimi uygulandı!</span>
        </motion.div>
      )}
    </div>
  )
}
