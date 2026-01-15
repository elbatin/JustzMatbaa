/**
 * Feature: justz-matbaa-ecommerce
 * Property 9: Dashboard Statistics Calculation
 * Validates: Requirements 7.2, 7.3, 7.4
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useOrderStore } from '../order-store'
import type { CartItem, CustomerInfo } from '@/types'

// Mock cart items
const createMockCartItem = (productId: string, productName: string, quantity: number, price: number): CartItem => ({
  id: `item_${Date.now()}_${Math.random()}`,
  product: {
    id: productId,
    slug: productName.toLowerCase().replace(/\s/g, '-'),
    name: productName,
    description: 'Test description',
    shortDescription: 'Short desc',
    category: 'kartvizit',
    basePrice: 100,
    images: ['/test.jpg'],
    printOptions: {
      sizes: [{ id: 's1', name: 'Standard', dimensions: '9x5', multiplier: 1 }],
      paperTypes: [{ id: 'p1', name: 'Matte', description: 'Matte', multiplier: 1 }],
      printSides: [{ id: 'ps1', name: 'Single', multiplier: 1 }],
      quantities: [100],
    },
    createdAt: '2024-01-01T00:00:00Z',
  },
  selectedOptions: {
    sizeId: 's1',
    paperTypeId: 'p1',
    printSideId: 'ps1',
    quantity,
  },
  calculatedPrice: price,
  addedAt: new Date().toISOString(),
})

const mockCustomerInfo: CustomerInfo = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '05321234567',
  address: 'Test Address',
  city: 'İstanbul',
  postalCode: '34000',
}

describe('Order Store - Property Tests', () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [] })
  })

  /**
   * Property 9: Total orders count should equal orders.length
   */
  it('should calculate total orders count correctly', () => {
    // Create multiple orders
    useOrderStore.getState().createOrder(
      [createMockCartItem('p1', 'Product 1', 100, 1000)],
      mockCustomerInfo,
      1000
    )
    useOrderStore.getState().createOrder(
      [createMockCartItem('p2', 'Product 2', 200, 2000)],
      mockCustomerInfo,
      2000
    )
    useOrderStore.getState().createOrder(
      [createMockCartItem('p3', 'Product 3', 300, 3000)],
      mockCustomerInfo,
      3000
    )

    const count = useOrderStore.getState().getTotalOrdersCount()
    const orders = useOrderStore.getState().orders

    expect(count).toBe(orders.length)
    expect(count).toBe(3)
  })

  /**
   * Property 9: Total revenue should equal sum of all order totals
   */
  it('should calculate total revenue correctly', () => {
    const amounts = [1000, 2500, 3750]
    
    amounts.forEach((amount, i) => {
      useOrderStore.getState().createOrder(
        [createMockCartItem(`p${i}`, `Product ${i}`, 100, amount)],
        mockCustomerInfo,
        amount
      )
    })

    const revenue = useOrderStore.getState().getTotalRevenue()
    const expectedRevenue = amounts.reduce((sum, a) => sum + a, 0)

    expect(revenue).toBe(expectedRevenue)
  })

  /**
   * Property 9: Best selling product should be product with highest quantity
   */
  it('should identify best selling product correctly', () => {
    // Order 1: Product A with 100 quantity
    useOrderStore.getState().createOrder(
      [createMockCartItem('prod_a', 'Product A', 100, 1000)],
      mockCustomerInfo,
      1000
    )
    
    // Order 2: Product B with 500 quantity (should be best seller)
    useOrderStore.getState().createOrder(
      [createMockCartItem('prod_b', 'Product B', 500, 5000)],
      mockCustomerInfo,
      5000
    )
    
    // Order 3: Product A with 200 more (total 300, still less than B)
    useOrderStore.getState().createOrder(
      [createMockCartItem('prod_a', 'Product A', 200, 2000)],
      mockCustomerInfo,
      2000
    )

    const bestSelling = useOrderStore.getState().getBestSellingProduct()

    expect(bestSelling).not.toBeNull()
    expect(bestSelling?.productId).toBe('prod_b')
    expect(bestSelling?.quantity).toBe(500)
  })

  /**
   * Property: Empty orders should return null for best selling
   */
  it('should return null for best selling when no orders', () => {
    const bestSelling = useOrderStore.getState().getBestSellingProduct()
    expect(bestSelling).toBeNull()
  })

  /**
   * Property: Dashboard stats should be consistent
   */
  it('should return consistent dashboard stats', () => {
    useOrderStore.getState().createOrder(
      [createMockCartItem('p1', 'Product 1', 100, 1000)],
      mockCustomerInfo,
      1000
    )
    useOrderStore.getState().createOrder(
      [createMockCartItem('p1', 'Product 1', 200, 2000)],
      mockCustomerInfo,
      2000
    )

    const stats = useOrderStore.getState().getDashboardStats()

    expect(stats.totalOrders).toBe(useOrderStore.getState().getTotalOrdersCount())
    expect(stats.totalRevenue).toBe(useOrderStore.getState().getTotalRevenue())
    expect(stats.bestSellingProduct).toEqual(useOrderStore.getState().getBestSellingProduct())
  })
})

describe('Order Store - Unit Tests', () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [] })
  })

  it('should create order with unique order number', () => {
    const order1 = useOrderStore.getState().createOrder(
      [createMockCartItem('p1', 'Product 1', 100, 1000)],
      mockCustomerInfo,
      1000
    )
    const order2 = useOrderStore.getState().createOrder(
      [createMockCartItem('p2', 'Product 2', 100, 1000)],
      mockCustomerInfo,
      1000
    )

    expect(order1.orderNumber).not.toBe(order2.orderNumber)
    expect(order1.orderNumber).toMatch(/^JM-/)
  })

  it('should find order by ID', () => {
    const order = useOrderStore.getState().createOrder(
      [createMockCartItem('p1', 'Product 1', 100, 1000)],
      mockCustomerInfo,
      1000
    )

    const found = useOrderStore.getState().getOrderById(order.id)
    expect(found).toBeDefined()
    expect(found?.id).toBe(order.id)
  })

  it('should find order by order number', () => {
    const order = useOrderStore.getState().createOrder(
      [createMockCartItem('p1', 'Product 1', 100, 1000)],
      mockCustomerInfo,
      1000
    )

    const found = useOrderStore.getState().getOrderByNumber(order.orderNumber)
    expect(found).toBeDefined()
    expect(found?.orderNumber).toBe(order.orderNumber)
  })

  it('should update order status', () => {
    const order = useOrderStore.getState().createOrder(
      [createMockCartItem('p1', 'Product 1', 100, 1000)],
      mockCustomerInfo,
      1000
    )

    expect(order.status).toBe('pending')

    useOrderStore.getState().updateOrderStatus(order.id, 'completed')

    const updated = useOrderStore.getState().getOrderById(order.id)
    expect(updated?.status).toBe('completed')
  })

  it('should get recent orders', () => {
    for (let i = 0; i < 15; i++) {
      useOrderStore.getState().createOrder(
        [createMockCartItem(`p${i}`, `Product ${i}`, 100, 1000)],
        mockCustomerInfo,
        1000
      )
    }

    const recent = useOrderStore.getState().getRecentOrders(5)
    expect(recent).toHaveLength(5)
  })
})
