/**
 * Cart Store - Zustand with localStorage persistence
 * 
 * Manages shopping cart state with persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product, SelectedPrintOptions } from '@/types'
import { generateId } from '@/lib/utils'
import { calculatePrice } from '@/lib/price-calculator'
import { logger } from '@/lib/logger'

interface CartStore {
  items: CartItem[]
  
  // Actions
  addItem: (product: Product, options: SelectedPrintOptions) => CartItem
  removeItem: (itemId: string) => boolean
  updateQuantity: (itemId: string, quantity: number) => boolean
  clearCart: () => void
  getItemCount: () => number
  getTotalAmount: () => number
  getItemById: (itemId: string) => CartItem | undefined
  hasItem: (productId: string, options: SelectedPrintOptions) => boolean
}

/**
 * Calculate price for a cart item based on product and selected options
 */
function calculateItemPrice(product: Product, options: SelectedPrintOptions): number {
  const size = product.printOptions.sizes.find(s => s.id === options.sizeId)
  const paper = product.printOptions.paperTypes.find(p => p.id === options.paperTypeId)
  const side = product.printOptions.printSides.find(s => s.id === options.printSideId)
  
  if (!size || !paper || !side) {
    return product.basePrice * options.quantity
  }
  
  return calculatePrice({
    basePrice: product.basePrice,
    sizeMultiplier: size.multiplier,
    paperTypeMultiplier: paper.multiplier,
    printSideMultiplier: side.multiplier,
    quantity: options.quantity,
  })
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, options: SelectedPrintOptions) => {
        const calculatedPrice = calculateItemPrice(product, options)
        
        const newItem: CartItem = {
          id: generateId(),
          product,
          selectedOptions: options,
          calculatedPrice,
          addedAt: new Date().toISOString(),
        }
        
        set(state => ({
          items: [...state.items, newItem]
        }))
        
        logger.addToCart(product.id, options.quantity)
        
        return newItem
      },

      removeItem: (itemId: string) => {
        const item = get().getItemById(itemId)
        
        if (!item) return false
        
        set(state => ({
          items: state.items.filter(i => i.id !== itemId)
        }))
        
        logger.removeFromCart(item.product.id)
        
        return true
      },

      updateQuantity: (itemId: string, quantity: number) => {
        const item = get().getItemById(itemId)
        
        if (!item || quantity < 1) return false
        
        const newOptions = { ...item.selectedOptions, quantity }
        const newPrice = calculateItemPrice(item.product, newOptions)
        
        set(state => ({
          items: state.items.map(i => 
            i.id === itemId 
              ? { ...i, selectedOptions: newOptions, calculatedPrice: newPrice }
              : i
          )
        }))
        
        logger.updateCartQuantity(item.product.id, quantity)
        
        return true
      },

      clearCart: () => {
        set({ items: [] })
      },

      getItemCount: () => {
        return get().items.length
      },

      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + item.calculatedPrice, 0)
      },

      getItemById: (itemId: string) => {
        return get().items.find(i => i.id === itemId)
      },

      hasItem: (productId: string, options: SelectedPrintOptions) => {
        return get().items.some(item => 
          item.product.id === productId &&
          item.selectedOptions.sizeId === options.sizeId &&
          item.selectedOptions.paperTypeId === options.paperTypeId &&
          item.selectedOptions.printSideId === options.printSideId &&
          item.selectedOptions.quantity === options.quantity
        )
      },
    }),
    {
      name: 'justz-matbaa-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)
