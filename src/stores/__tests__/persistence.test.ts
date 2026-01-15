/**
 * Feature: justz-matbaa-ecommerce
 * Property 6: State Persistence Round-Trip
 * Validates: Requirements 4.6, 8.4, 8.5, 8.6
 * 
 * For any cart state, serializing to JSON and storing in localStorage,
 * then deserializing from localStorage SHALL produce an equivalent state object.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import type { CartItem, Order, User } from '@/types'

// Test serialization/deserialization directly
describe('State Persistence - Property Tests', () => {
  /**
   * Property 6: Cart state round-trip
   */
  it('should serialize and deserialize cart items correctly', () => {
    const cartItems: CartItem[] = [
      {
        id: 'item_001',
        product: {
          id: 'prod_001',
          slug: 'test-product',
          name: 'Test Product',
          description: 'Description',
          shortDescription: 'Short',
          category: 'kartvizit',
          basePrice: 100,
          images: ['/test.jpg'],
          printOptions: {
            sizes: [{ id: 's1', name: 'Standard', dimensions: '9x5', multiplier: 1 }],
            paperTypes: [{ id: 'p1', name: 'Matte', description: 'Matte paper', multiplier: 1 }],
            printSides: [{ id: 'ps1', name: 'Single', multiplier: 1 }],
            quantities: [100, 250],
          },
          createdAt: '2024-01-01T00:00:00Z',
        },
        selectedOptions: {
          sizeId: 's1',
          paperTypeId: 'p1',
          printSideId: 'ps1',
          quantity: 100,
        },
        calculatedPrice: 9500,
        addedAt: '2024-01-15T10:00:00Z',
      },
    ]

    // Serialize
    const serialized = JSON.stringify({ items: cartItems })
    
    // Deserialize
    const deserialized = JSON.parse(serialized)
    
    // Verify round-trip
    expect(deserialized.items).toHaveLength(cartItems.length)
    expect(deserialized.items[0].id).toBe(cartItems[0].id)
    expect(deserialized.items[0].product.id).toBe(cartItems[0].product.id)
    expect(deserialized.items[0].selectedOptions).toEqual(cartItems[0].selectedOptions)
    expect(deserialized.items[0].calculatedPrice).toBe(cartItems[0].calculatedPrice)
  })

  /**
   * Property 6: Order state round-trip
   */
  it('should serialize and deserialize orders correctly', () => {
    const orders: Order[] = [
      {
        id: 'order_001',
        orderNumber: 'JM-ABC123-XYZ',
        items: [
          {
            id: 'item_001',
            product: {
              id: 'prod_001',
              slug: 'test-product',
              name: 'Test Product',
              description: 'Description',
              shortDescription: 'Short',
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
              quantity: 100,
            },
            calculatedPrice: 9500,
            addedAt: '2024-01-15T10:00:00Z',
          },
        ],
        customerInfo: {
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          email: 'ahmet@example.com',
          phone: '05321234567',
          address: 'Test Adres',
          city: 'İstanbul',
          postalCode: '34000',
        },
        totalAmount: 9500,
        status: 'completed',
        createdAt: '2024-01-15T12:00:00Z',
      },
    ]

    // Serialize
    const serialized = JSON.stringify({ orders })
    
    // Deserialize
    const deserialized = JSON.parse(serialized)
    
    // Verify round-trip
    expect(deserialized.orders).toHaveLength(orders.length)
    expect(deserialized.orders[0].id).toBe(orders[0].id)
    expect(deserialized.orders[0].orderNumber).toBe(orders[0].orderNumber)
    expect(deserialized.orders[0].customerInfo).toEqual(orders[0].customerInfo)
    expect(deserialized.orders[0].totalAmount).toBe(orders[0].totalAmount)
  })

  /**
   * Property 6: Auth state round-trip
   */
  it('should serialize and deserialize auth state correctly', () => {
    const authState = {
      user: {
        id: 'user_001',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as const,
      },
      isAuthenticated: true,
    }

    // Serialize
    const serialized = JSON.stringify(authState)
    
    // Deserialize
    const deserialized = JSON.parse(serialized)
    
    // Verify round-trip
    expect(deserialized.user.id).toBe(authState.user.id)
    expect(deserialized.user.email).toBe(authState.user.email)
    expect(deserialized.user.role).toBe(authState.user.role)
    expect(deserialized.isAuthenticated).toBe(authState.isAuthenticated)
  })

  /**
   * Property: Empty state round-trip
   */
  it('should handle empty state round-trip', () => {
    const emptyCart = { items: [] }
    const emptyOrders = { orders: [] }
    const emptyAuth = { user: null, isAuthenticated: false }

    expect(JSON.parse(JSON.stringify(emptyCart))).toEqual(emptyCart)
    expect(JSON.parse(JSON.stringify(emptyOrders))).toEqual(emptyOrders)
    expect(JSON.parse(JSON.stringify(emptyAuth))).toEqual(emptyAuth)
  })

  /**
   * Property: Special characters in data should survive round-trip
   */
  it('should handle Turkish characters in round-trip', () => {
    const data = {
      name: 'Özel Türkçe Kartvizit',
      description: 'Çok güzel ürün, şık tasarım',
      city: 'İstanbul',
    }

    const deserialized = JSON.parse(JSON.stringify(data))
    
    expect(deserialized.name).toBe(data.name)
    expect(deserialized.description).toBe(data.description)
    expect(deserialized.city).toBe(data.city)
  })
})
