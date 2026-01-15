'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { toast } from 'sonner'
import type { Product, SelectedPrintOptions } from '@/types'

interface AddToCartProps {
  product: Product
  selectedOptions: SelectedPrintOptions
}

export function AddToCart({ product, selectedOptions }: AddToCartProps) {
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product, selectedOptions)
    setIsAdded(true)
    
    toast.success('Ürün sepete eklendi!', {
      description: `${product.name} sepetinize eklendi.`,
      action: {
        label: 'Sepete Git',
        onClick: () => window.location.href = '/cart',
      },
    })

    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button 
      size="lg" 
      className="w-full gap-2"
      onClick={handleAddToCart}
      disabled={isAdded}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.div
            key="added"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <Check className="h-5 w-5" />
            Sepete Eklendi
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            Sepete Ekle
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
