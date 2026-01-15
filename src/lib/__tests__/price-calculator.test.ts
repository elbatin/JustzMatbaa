/**
 * Feature: justz-matbaa-ecommerce
 * Property 1: Dynamic Price Calculation
 * Validates: Requirements 3.7, 3.9
 * 
 * For any product with base price and for any valid combination of print options,
 * the calculated price SHALL equal:
 * basePrice × sizeMultiplier × paperTypeMultiplier × printSideMultiplier × quantity × quantityScale
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { 
  calculatePrice, 
  getQuantityScale, 
  calculateUnitPrice,
  getDiscountPercentage 
} from '../price-calculator'
import type { PriceCalculationInput } from '@/types'

describe('Price Calculator - Property Tests', () => {
  /**
   * Property 1: Dynamic Price Calculation
   * For all valid inputs, the price calculation formula must hold
   */
  it('should calculate price correctly for all valid inputs', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1, max: 10000, noNaN: true }),      // basePrice
        fc.float({ min: 0.5, max: 3, noNaN: true }),        // sizeMultiplier
        fc.float({ min: 0.5, max: 3, noNaN: true }),        // paperTypeMultiplier
        fc.float({ min: 1, max: 2, noNaN: true }),          // printSideMultiplier
        fc.integer({ min: 1, max: 10000 }),                  // quantity
        (basePrice, sizeMultiplier, paperTypeMultiplier, printSideMultiplier, quantity) => {
          const input: PriceCalculationInput = {
            basePrice,
            sizeMultiplier,
            paperTypeMultiplier,
            printSideMultiplier,
            quantity,
          }
          
          const result = calculatePrice(input)
          const quantityScale = getQuantityScale(quantity)
          const expected = basePrice * sizeMultiplier * paperTypeMultiplier * printSideMultiplier * quantity * quantityScale
          const expectedRounded = Math.round(expected * 100) / 100
          
          // Allow small floating point differences
          return Math.abs(result - expectedRounded) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Price is always non-negative
   */
  it('should always return non-negative price', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0), max: Math.fround(10000), noNaN: true }),
        fc.float({ min: Math.fround(0.1), max: Math.fround(5), noNaN: true }),
        fc.float({ min: Math.fround(0.1), max: Math.fround(5), noNaN: true }),
        fc.float({ min: Math.fround(0.1), max: Math.fround(5), noNaN: true }),
        fc.integer({ min: 1, max: 10000 }),
        (basePrice, sizeMultiplier, paperTypeMultiplier, printSideMultiplier, quantity) => {
          const result = calculatePrice({
            basePrice,
            sizeMultiplier,
            paperTypeMultiplier,
            printSideMultiplier,
            quantity,
          })
          return result >= 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Higher quantity should result in lower or equal unit price
   */
  it('should give lower or equal unit price for higher quantities', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 100, max: 1000, noNaN: true }),
        fc.float({ min: 1, max: 2, noNaN: true }),
        fc.float({ min: 1, max: 2, noNaN: true }),
        fc.float({ min: 1, max: 2, noNaN: true }),
        fc.integer({ min: 1, max: 5000 }),
        fc.integer({ min: 1, max: 5000 }),
        (basePrice, sizeMultiplier, paperTypeMultiplier, printSideMultiplier, qty1, qty2) => {
          const lowerQty = Math.min(qty1, qty2)
          const higherQty = Math.max(qty1, qty2)
          
          if (lowerQty === higherQty) return true
          
          const unitPriceLow = calculateUnitPrice({
            basePrice,
            sizeMultiplier,
            paperTypeMultiplier,
            printSideMultiplier,
            quantity: lowerQty,
          })
          
          const unitPriceHigh = calculateUnitPrice({
            basePrice,
            sizeMultiplier,
            paperTypeMultiplier,
            printSideMultiplier,
            quantity: higherQty,
          })
          
          // Higher quantity should have lower or equal unit price
          return unitPriceHigh <= unitPriceLow + 0.01 // Small tolerance for floating point
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Quantity scale is always between 0 and 1
   */
  it('should return quantity scale between 0 and 1', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100000 }),
        (quantity) => {
          const scale = getQuantityScale(quantity)
          return scale > 0 && scale <= 1
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Discount percentage is between 0 and 100
   */
  it('should return discount percentage between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100000 }),
        (quantity) => {
          const discount = getDiscountPercentage(quantity)
          return discount >= 0 && discount <= 100
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe('Price Calculator - Unit Tests', () => {
  it('should calculate correct price for standard kartvizit', () => {
    const result = calculatePrice({
      basePrice: 150,
      sizeMultiplier: 1,
      paperTypeMultiplier: 1,
      printSideMultiplier: 1,
      quantity: 100,
    })
    
    // 150 * 1 * 1 * 1 * 100 * 0.95 = 14250
    expect(result).toBe(14250)
  })

  it('should apply volume discount for large quantities', () => {
    const smallQty = calculatePrice({
      basePrice: 100,
      sizeMultiplier: 1,
      paperTypeMultiplier: 1,
      printSideMultiplier: 1,
      quantity: 50,
    })
    
    const largeQty = calculatePrice({
      basePrice: 100,
      sizeMultiplier: 1,
      paperTypeMultiplier: 1,
      printSideMultiplier: 1,
      quantity: 5000,
    })
    
    // Unit price should be lower for large quantity
    expect(largeQty / 5000).toBeLessThan(smallQty / 50)
  })

  it('should return 0 for invalid inputs', () => {
    expect(calculatePrice({
      basePrice: -100,
      sizeMultiplier: 1,
      paperTypeMultiplier: 1,
      printSideMultiplier: 1,
      quantity: 100,
    })).toBe(0)

    expect(calculatePrice({
      basePrice: 100,
      sizeMultiplier: 1,
      paperTypeMultiplier: 1,
      printSideMultiplier: 1,
      quantity: 0,
    })).toBe(0)
  })
})
