/**
 * Product Store - Zustand
 * 
 * Manages product data and operations
 */

import { create } from 'zustand'
import type { Product, ProductCategory } from '@/types'
import productsData from '@/data/products.json'
import { generateId, generateSlug } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface ProductStore {
  products: Product[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProducts: () => Promise<void>
  getProductBySlug: (slug: string) => Product | undefined
  getProductById: (id: string) => Product | undefined
  getProductsByCategory: (category: ProductCategory) => Product[]
  getFeaturedProducts: () => Product[]
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'createdAt'>) => Product
  deleteProduct: (productId: string) => boolean
  updateProduct: (productId: string, updates: Partial<Product>) => Product | undefined
  searchProducts: (query: string) => Product[]
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Load from mock data
      const products = productsData.products as Product[]
      set({ products, isLoading: false })
    } catch (error) {
      set({ 
        error: 'Ürünler yüklenirken bir hata oluştu', 
        isLoading: false 
      })
    }
  },

  getProductBySlug: (slug: string) => {
    return get().products.find(p => p.slug === slug)
  },

  getProductById: (id: string) => {
    return get().products.find(p => p.id === id)
  },

  getProductsByCategory: (category: ProductCategory) => {
    return get().products.filter(p => p.category === category)
  },

  getFeaturedProducts: () => {
    return get().products.filter(p => p.featured)
  },

  addProduct: (productData) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${generateId()}`,
      slug: generateSlug(productData.name),
      createdAt: new Date().toISOString(),
    }
    
    set(state => ({
      products: [...state.products, newProduct]
    }))
    
    logger.adminAddProduct(newProduct.id, newProduct.name)
    
    return newProduct
  },

  deleteProduct: (productId: string) => {
    const product = get().getProductById(productId)
    
    if (!product) return false
    
    set(state => ({
      products: state.products.filter(p => p.id !== productId)
    }))
    
    logger.adminDeleteProduct(productId, product.name)
    
    return true
  },

  updateProduct: (productId: string, updates: Partial<Product>) => {
    const product = get().getProductById(productId)
    
    if (!product) return undefined
    
    const updatedProduct = { ...product, ...updates }
    
    set(state => ({
      products: state.products.map(p => 
        p.id === productId ? updatedProduct : p
      )
    }))
    
    return updatedProduct
  },

  searchProducts: (query: string) => {
    const lowerQuery = query.toLowerCase()
    return get().products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.shortDescription.toLowerCase().includes(lowerQuery)
    )
  },
}))

// Export categories data
export const categories = productsData.categories
