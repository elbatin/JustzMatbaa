/**
 * Feature: justz-matbaa-ecommerce
 * Property 7: Form Validation
 * Validates: Requirements 5.2, 9.3
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { 
  validateEmail, 
  validatePhone, 
  validateCustomerInfo,
  validateRequired,
  validatePostalCode,
  getFieldError,
  hasFieldError
} from '../validators'
import type { CustomerInfo } from '@/types'

describe('Form Validators - Property Tests', () => {
  /**
   * Property: Empty strings should always fail required validation
   */
  it('should reject empty strings for required fields', () => {
    fc.assert(
      fc.property(
        fc.constant(''),
        fc.string({ minLength: 1, maxLength: 10 }),
        (value, fieldName) => {
          const result = validateRequired(value, fieldName)
          return !result.isValid && result.error !== undefined
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Valid emails should pass
   */
  it('should accept valid email formats', () => {
    const validEmails = ['test@example.com', 'user@domain.co', 'a@b.cd']
    validEmails.forEach(email => {
      expect(validateEmail(email).isValid).toBe(true)
    })
  })

  /**
   * Property: Invalid emails should fail
   */
  it('should reject invalid email formats', () => {
    const invalidEmails = ['', 'invalid', '@domain.com', 'user@', 'user@.com']
    invalidEmails.forEach(email => {
      const result = validateEmail(email)
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  /**
   * Property: Valid Turkish phone numbers should be accepted
   */
  it('should accept valid Turkish phone numbers', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 99999999 }),
        (suffix) => {
          const phone = `053${suffix.toString().padStart(8, '0')}`
          const result = validatePhone(phone)
          return result.isValid
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Valid postal codes should be accepted
   */
  it('should accept valid postal codes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10000, max: 99999 }),
        (code) => {
          const result = validatePostalCode(code.toString())
          return result.isValid
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Invalid postal codes should be rejected
   */
  it('should reject invalid postal codes', () => {
    const invalidCodes = ['', '1234', '123456', 'abcde']
    invalidCodes.forEach(code => {
      const result = validatePostalCode(code)
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})

describe('Form Validators - Unit Tests', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com').isValid).toBe(true)
  })

  it('should reject invalid email', () => {
    expect(validateEmail('').isValid).toBe(false)
    expect(validateEmail('invalid').isValid).toBe(false)
  })

  it('should validate correct Turkish phone', () => {
    expect(validatePhone('05321234567').isValid).toBe(true)
    expect(validatePhone('0532 123 45 67').isValid).toBe(true)
  })

  it('should reject invalid phone', () => {
    expect(validatePhone('').isValid).toBe(false)
    expect(validatePhone('1234567890').isValid).toBe(false)
  })

  it('should validate complete customer info', () => {
    const validInfo: CustomerInfo = {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '05321234567',
      address: 'Atatürk Caddesi No: 123',
      city: 'İstanbul',
      postalCode: '34000',
    }
    
    const result = validateCustomerInfo(validInfo)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should return errors for invalid customer info', () => {
    const invalidInfo: Partial<CustomerInfo> = {
      firstName: '',
      lastName: 'Y',
      email: 'invalid',
      phone: '123',
      address: 'short',
      city: '',
      postalCode: '123',
    }
    
    const result = validateCustomerInfo(invalidInfo)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(hasFieldError(result, 'firstName')).toBe(true)
    expect(hasFieldError(result, 'email')).toBe(true)
    expect(getFieldError(result, 'firstName')).toBeDefined()
  })
})
