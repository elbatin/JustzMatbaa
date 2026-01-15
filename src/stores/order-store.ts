/**
 * Order Store - Zustand with localStorage persistence
 * 
 * Manages order state and statistics
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Order, CartItem, CustomerInfo, DashboardStats } from '@/types'
import { generateId, generateOrderNumber } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface OrderStore {
  orders: Order[]
  
  // Actions
  createOrder: (items: CartItem[], customerInfo: CustomerInfo, totalAmount: number) => Order
  getOrderById: (orderId: string) => Order | undefined
  getOrderByNumber: (orderNumber: string) => Order | undefined
  updateOrderStatus: (orderId: string, status: Order['status']) => boolean
  
  // Statistics
  getTotalRevenue: () => number
  getTotalOrdersCount: () => number
  getBestSellingProduct: () => { productId: string; productName: string; quantity: number } | null
  getDashboardStats: () => DashboardStats
  getRecentOrders: (count?: number) => Order[]
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (items: CartItem[], customerInfo: CustomerInfo, totalAmount: number) => {
        const newOrder: Order = {
          id: `order_${generateId()}`,
          orderNumber: generateOrderNumber(),
          items,
          customerInfo,
          totalAmount,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
        
        set(state => ({
          orders: [newOrder, ...state.orders]
        }))
        
        logger.checkoutComplete(newOrder.id, newOrder.orderNumber, totalAmount)
        
        return newOrder
      },

      getOrderById: (orderId: string) => {
        return get().orders.find(o => o.id === orderId)
      },

      getOrderByNumber: (orderNumber: string) => {
        return get().orders.find(o => o.orderNumber === orderNumber)
      },

      updateOrderStatus: (orderId: string, status: Order['status']) => {
        const order = get().getOrderById(orderId)
        
        if (!order) return false
        
        set(state => ({
          orders: state.orders.map(o => 
            o.id === orderId ? { ...o, status } : o
          )
        }))
        
        return true
      },

      getTotalRevenue: () => {
        return get().orders.reduce((total, order) => total + order.totalAmount, 0)
      },

      getTotalOrdersCount: () => {
        return get().orders.length
      },

      getBestSellingProduct: () => {
        const orders = get().orders
        
        if (orders.length === 0) return null
        
        // Count quantities per product
        const productCounts: Record<string, { name: string; quantity: number }> = {}
        
        orders.forEach(order => {
          order.items.forEach(item => {
            const productId = item.product.id
            if (!productCounts[productId]) {
              productCounts[productId] = { 
                name: item.product.name, 
                quantity: 0 
              }
            }
            productCounts[productId].quantity += item.selectedOptions.quantity
          })
        })
        
        // Find best selling
        let bestProduct: { productId: string; productName: string; quantity: number } | null = null
        let maxQuantity = 0
        
        Object.entries(productCounts).forEach(([productId, data]) => {
          if (data.quantity > maxQuantity) {
            maxQuantity = data.quantity
            bestProduct = {
              productId,
              productName: data.name,
              quantity: data.quantity,
            }
          }
        })
        
        return bestProduct
      },

      getDashboardStats: () => {
        return {
          totalOrders: get().getTotalOrdersCount(),
          totalRevenue: get().getTotalRevenue(),
          bestSellingProduct: get().getBestSellingProduct(),
        }
      },

      getRecentOrders: (count: number = 10) => {
        return get().orders.slice(0, count)
      },
    }),
    {
      name: 'justz-matbaa-orders',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ orders: state.orders }),
    }
  )
)
