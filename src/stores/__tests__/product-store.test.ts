/**
 * Feature: justz-matbaa-ecommerce
 * Property 2: Category Filtering Correctness
 * Property 10: Admin Product CRUD
 * Validates: Requirements 2.1, 7.6, 7.7
 */

import { describe, it, expect, beforeEach } from 'vitest'
import fc from 'fast-check'
import { useProductStore } from '../product-store'
import type { ProductCategory } from '@/types'

const CATEGORIES: ProductCategory[] = ['kartvizit', 'brosur', 'afis', 'katalog', 'ozel-baski']

describe('Product Store - Property Tests', () => {
  beforeEach(async () => {
    // Reset store and load products
    useProductStore.setState({ products: [], isLoading: false, error: null })
    await useProductStore.getState().fetchProducts()
  })

  /**
   * Property 2: Category Filtering Correctness
   * For any category, filtered results should only contain products of that category
   */
  it('should filter products correctly by category', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...CATEGORIES),
        (category) => {
          const filtered = useProductStore.getState().getProductsByCategory(category)
          return filtered.every(product => product.category === category)
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: All filtered products should be subset of all products
   */
  it('should return subset of all products when filtering', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...CATEGORIES),
        (category) => {
          const allProducts = useProductStore.getState().products
          const filtered = useProductStore.getState().getProductsByCategory(category)
          return filtered.every(fp => allProducts.some(ap => ap.id === fp.id))
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property 10: Admin Product CRUD - Add
   * Adding a product should increase product count by 1
   */
  it('should increase product count by 1 when adding', () => {
    const initialCount = useProductStore.getState().products.length
    
    useProductStore.getState().addProduct({
      name: 'Test Ürün',
      description: 'Test açıklama',
      shortDescription: 'Kısa açıklama',
      category: 'kartvizit',
      basePrice: 100,
      images: ['/test.jpg'],
      printOptions: {
        sizes: [{ id: 's1', name: 'Standart', dimensions: '9x5', multiplier: 1 }],
        paperTypes: [{ id: 'p1', name: 'Mat', description: 'Mat kuşe', multiplier: 1 }],
        printSides: [{ id: 'ps1', name: 'Tek Yüz', multiplier: 1 }],
        quantities: [100, 250, 500],
      },
    })
    
    expect(useProductStore.getState().products.length).toBe(initialCount + 1)
  })

  /**
   * Property 10: Admin Product CRUD - Delete
   * Deleting a product should decrease product count by 1
   */
  it('should decrease product count by 1 when deleting', () => {
    const products = useProductStore.getState().products
    if (products.length === 0) return
    
    const initialCount = products.length
    const productToDelete = products[0]
    
    useProductStore.getState().deleteProduct(productToDelete.id)
    
    expect(useProductStore.getState().products.length).toBe(initialCount - 1)
    expect(useProductStore.getState().getProductById(productToDelete.id)).toBeUndefined()
  })

  /**
   * Property: Added product should be findable by slug
   */
  it('should find added product by slug', () => {
    const newProduct = useProductStore.getState().addProduct({
      name: 'Özel Test Kartvizit',
      description: 'Test açıklama',
      shortDescription: 'Kısa açıklama',
      category: 'kartvizit',
      basePrice: 150,
      images: ['/test.jpg'],
      printOptions: {
        sizes: [{ id: 's1', name: 'Standart', dimensions: '9x5', multiplier: 1 }],
        paperTypes: [{ id: 'p1', name: 'Mat', description: 'Mat kuşe', multiplier: 1 }],
        printSides: [{ id: 'ps1', name: 'Tek Yüz', multiplier: 1 }],
        quantities: [100],
      },
    })
    
    const found = useProductStore.getState().getProductBySlug(newProduct.slug)
    expect(found).toBeDefined()
    expect(found?.id).toBe(newProduct.id)
  })
})

describe('Product Store - Unit Tests', () => {
  beforeEach(async () => {
    useProductStore.setState({ products: [], isLoading: false, error: null })
    await useProductStore.getState().fetchProducts()
  })

  it('should load products from mock data', () => {
    const products = useProductStore.getState().products
    expect(products.length).toBeGreaterThan(0)
  })

  it('should get featured products', () => {
    const featured = useProductStore.getState().getFeaturedProducts()
    expect(featured.every(p => p.featured)).toBe(true)
  })

  it('should search products by name', () => {
    const results = useProductStore.getState().searchProducts('kartvizit')
    expect(results.length).toBeGreaterThan(0)
  })

  it('should return undefined for non-existent product', () => {
    const product = useProductStore.getState().getProductById('non-existent')
    expect(product).toBeUndefined()
  })

  it('should return false when deleting non-existent product', () => {
    const result = useProductStore.getState().deleteProduct('non-existent')
    expect(result).toBe(false)
  })
})
