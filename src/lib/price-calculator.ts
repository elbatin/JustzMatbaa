/**
 * JustzMatbaa Price Calculator
 * 
 * Calculates dynamic pricing based on:
 * - Base product price
 * - Size multiplier
 * - Paper type multiplier
 * - Print side multiplier
 * - Quantity scale (volume discounts)
 */

import type { PriceCalculationInput } from '@/types'

/**
 * Quantity scale tiers for volume discounts
 * Higher quantities get better per-unit pricing
 */
const QUANTITY_SCALES: { min: number; max: number; scale: number }[] = [
  { min: 1, max: 99, scale: 1.0 },
  { min: 100, max: 249, scale: 0.95 },
  { min: 250, max: 499, scale: 0.90 },
  { min: 500, max: 999, scale: 0.85 },
  { min: 1000, max: 2499, scale: 0.80 },
  { min: 2500, max: 4999, scale: 0.75 },
  { min: 5000, max: 9999, scale: 0.70 },
  { min: 10000, max: Infinity, scale: 0.65 },
]

/**
 * Get quantity scale factor based on quantity
 * Returns a multiplier that decreases with higher quantities (volume discount)
 */
export function getQuantityScale(quantity: number): number {
  if (quantity < 1) return 1
  
  const tier = QUANTITY_SCALES.find(
    t => quantity >= t.min && quantity <= t.max
  )
  
  return tier?.scale ?? 1
}

/**
 * Calculate total price based on all factors
 * 
 * Formula: basePrice × sizeMultiplier × paperTypeMultiplier × printSideMultiplier × quantity × quantityScale
 * 
 * @param input - Price calculation input parameters
 * @returns Calculated total price (rounded to 2 decimal places)
 */
export function calculatePrice(input: PriceCalculationInput): number {
  const {
    basePrice,
    sizeMultiplier,
    paperTypeMultiplier,
    printSideMultiplier,
    quantity,
  } = input

  // Validate inputs
  if (basePrice < 0 || quantity < 1) {
    return 0
  }

  const quantityScale = getQuantityScale(quantity)
  
  const totalPrice = 
    basePrice * 
    sizeMultiplier * 
    paperTypeMultiplier * 
    printSideMultiplier * 
    quantity * 
    quantityScale

  // Round to 2 decimal places
  return Math.round(totalPrice * 100) / 100
}

/**
 * Calculate unit price (price per single item)
 */
export function calculateUnitPrice(input: PriceCalculationInput): number {
  const totalPrice = calculatePrice(input)
  if (input.quantity < 1) return 0
  return Math.round((totalPrice / input.quantity) * 100) / 100
}

/**
 * Calculate savings compared to buying at minimum quantity
 */
export function calculateSavings(input: PriceCalculationInput): number {
  const currentScale = getQuantityScale(input.quantity)
  const baseScale = getQuantityScale(1)
  
  if (currentScale >= baseScale) return 0
  
  const fullPrice = 
    input.basePrice * 
    input.sizeMultiplier * 
    input.paperTypeMultiplier * 
    input.printSideMultiplier * 
    input.quantity * 
    baseScale
    
  const discountedPrice = calculatePrice(input)
  
  return Math.round((fullPrice - discountedPrice) * 100) / 100
}

/**
 * Get discount percentage based on quantity
 */
export function getDiscountPercentage(quantity: number): number {
  const scale = getQuantityScale(quantity)
  return Math.round((1 - scale) * 100)
}

/**
 * Format price breakdown for display
 */
export function getPriceBreakdown(input: PriceCalculationInput): {
  basePrice: number
  sizeMultiplier: number
  paperTypeMultiplier: number
  printSideMultiplier: number
  quantity: number
  quantityScale: number
  discountPercentage: number
  unitPrice: number
  totalPrice: number
  savings: number
} {
  return {
    basePrice: input.basePrice,
    sizeMultiplier: input.sizeMultiplier,
    paperTypeMultiplier: input.paperTypeMultiplier,
    printSideMultiplier: input.printSideMultiplier,
    quantity: input.quantity,
    quantityScale: getQuantityScale(input.quantity),
    discountPercentage: getDiscountPercentage(input.quantity),
    unitPrice: calculateUnitPrice(input),
    totalPrice: calculatePrice(input),
    savings: calculateSavings(input),
  }
}
