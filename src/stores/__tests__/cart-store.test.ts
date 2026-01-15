/**
 * Feature: justz-matbaa-ecommerce
 * Property 3: Cart Item Addition
 * Property 4: Cart Item Removal
 * Property 5: Cart Total Calculation
 * Validates: Requirements 3.8, 4.2, 4.3, 4.4
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../cart-store'
import type { Product, SelectedPrintOptions } from '@/types'

// Mock product for testing
const mockProduct: Product = {
  id: 'test_001',
  slug: 'test-kartvizit',
  name: 'Test Kartvizit',
  description: 'Test açıklama',
  shortDescription: 'Kısa açıklama',
  category: 'kartvizit',
  basePrice: 100,
  images: ['/test.jpg'],
  printOptions: {
    sizes: [
      { id: 'size_standard', name: 'Standart', dimensions: '9x5 cm', multiplier: 1 },
      { id: 'size_large', name: 'Büyük', dimensions: '10x6 cm', multiplier: 1.2 },
    ],
    paperTypes: [
      { id: 'paper_matte', name: 'Mat Kuşe', description: '350gr mat', multiplier: 1 },
      { id: 'paper_glossy', name: 'Parlak Kuşe', description: '350gr parlak', multiplier: 1.1 },
    ],
    printSides: [
      { id: 'side_single', name: 'Tek Yüz', multiplier: 1 },
      { id: 'side_double', name: 'Çift Yüz', multiplier: 1.6 },
    ],
    quantities: [100, 250, 500, 1000],
  },
  createdAt: '2024-01-01T00:00:00Z',
}

const defaultOptions: SelectedPrintOptions = {
  sizeId: 'size_standard',
  paperTypeId: 'paper_matte',
  printSideId: 'side_single',
  quantity: 100,
}

describe('Cart Store - Property Tests', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  /**
   * Property 3: Cart Item Addition
   * Adding an item should increase cart count by 1
   */
  it('should increase cart count by 1 when adding item', () => {
    const initialCount = useCartStore.getState().getItemCount()
    
    useCartStore.getState().addItem(mockProduct, defaultOptions)
    
    expect(useCartStore.getState().getItemCount()).toBe(initialCount + 1)
  })

  /**
   * Property 3: Added item should contain correct product and options
   */
  it('should add item with correct product and options', () => {
    const item = useCartStore.getState().addItem(mockProduct, defaultOptions)
    
    expect(item.product.id).toBe(mockProduct.id)
    expect(item.selectedOptions).toEqual(defaultOptions)
    expect(item.calculatedPrice).toBeGreaterThan(0)
  })

  /**
   * Property 4: Cart Item Removal
   * Removing an item should decrease cart count by 1
   */
  it('should decrease cart count by 1 when removing item', () => {
    const item = useCartStore.getState().addItem(mockProduct, defaultOptions)
    const countAfterAdd = useCartStore.getState().getItemCount()
    
    useCartStore.getState().removeItem(item.id)
    
    expect(useCartStore.getState().getItemCount()).toBe(countAfterAdd - 1)
  })

  /**
   * Property 4: Removed item should no longer exist in cart
   */
  it('should not find removed item in cart', () => {
    const item = useCartStore.getState().addItem(mockProduct, defaultOptions)
    
    useCartStore.getState().removeItem(item.id)
    
    expect(useCartStore.getState().getItemById(item.id)).toBeUndefined()
  })

  /**
   * Property 5: Cart Total Calculation
   * Total should equal sum of all item prices
   */
  it('should calculate total as sum of all item prices', () => {
    const item1 = useCartStore.getState().addItem(mockProduct, defaultOptions)
    const item2 = useCartStore.getState().addItem(mockProduct, {
      ...defaultOptions,
      quantity: 250,
    })
    
    const total = useCartStore.getState().getTotalAmount()
    const expectedTotal = item1.calculatedPrice + item2.calculatedPrice
    
    expect(total).toBe(expectedTotal)
  })

  /**
   * Property: Empty cart should have zero total
   */
  it('should have zero total when cart is empty', () => {
    expect(useCartStore.getState().getTotalAmount()).toBe(0)
  })

  /**
   * Property: Updating quantity should recalculate price
   */
  it('should recalculate price when quantity is updated', () => {
    const item = useCartStore.getState().addItem(mockProduct, defaultOptions)
    const originalPrice = item.calculatedPrice
    
    useCartStore.getState().updateQuantity(item.id, 500)
    
    const updatedItem = useCartStore.getState().getItemById(item.id)
    expect(updatedItem?.calculatedPrice).not.toBe(originalPrice)
    expect(updatedItem?.selectedOptions.quantity).toBe(500)
  })
})

describe('Cart Store - Unit Tests', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  it('should clear all items', () => {
    useCartStore.getState().addItem(mockProduct, defaultOptions)
    useCartStore.getState().addItem(mockProduct, { ...defaultOptions, quantity: 250 })
    
    useCartStore.getState().clearCart()
    
    expect(useCartStore.getState().getItemCount()).toBe(0)
  })

  it('should return false when removing non-existent item', () => {
    const result = useCartStore.getState().removeItem('non-existent')
    expect(result).toBe(false)
  })

  it('should return false when updating non-existent item', () => {
    const result = useCartStore.getState().updateQuantity('non-existent', 100)
    expect(result).toBe(false)
  })

  it('should return false when updating with invalid quantity', () => {
    const item = useCartStore.getState().addItem(mockProduct, defaultOptions)
    const result = useCartStore.getState().updateQuantity(item.id, 0)
    expect(result).toBe(false)
  })

  it('should check if item exists with specific options', () => {
    useCartStore.getState().addItem(mockProduct, defaultOptions)
    
    expect(useCartStore.getState().hasItem(mockProduct.id, defaultOptions)).toBe(true)
    expect(useCartStore.getState().hasItem(mockProduct.id, { ...defaultOptions, quantity: 999 })).toBe(false)
  })
})
