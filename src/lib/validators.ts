/**
 * JustzMatbaa Form Validators
 * 
 * Validation functions for customer information and form inputs
 */

import type { CustomerInfo, ValidationResult, ValidationError } from '@/types'

/**
 * Email validation regex
 * Matches standard email format
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Turkish phone number regex
 * Matches formats: 05XX XXX XX XX, +90 5XX XXX XX XX, etc.
 */
const PHONE_REGEX = /^(\+90|0)?[5][0-9]{9}$/

/**
 * Postal code regex (Turkish format: 5 digits)
 */
const POSTAL_CODE_REGEX = /^[0-9]{5}$/

/**
 * Validate email address
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim()
  
  if (!trimmed) {
    return { isValid: false, error: 'E-posta adresi gereklidir' }
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Geçerli bir e-posta adresi giriniz' }
  }
  
  return { isValid: true }
}

/**
 * Validate phone number (Turkish format)
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  if (!cleaned) {
    return { isValid: false, error: 'Telefon numarası gereklidir' }
  }
  
  if (!PHONE_REGEX.test(cleaned)) {
    return { isValid: false, error: 'Geçerli bir telefon numarası giriniz (05XX XXX XX XX)' }
  }
  
  return { isValid: true }
}

/**
 * Validate required text field
 */
export function validateRequired(value: string, fieldName: string): { isValid: boolean; error?: string } {
  const trimmed = value.trim()
  
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} gereklidir` }
  }
  
  return { isValid: true }
}

/**
 * Validate minimum length
 */
export function validateMinLength(
  value: string, 
  minLength: number, 
  fieldName: string
): { isValid: boolean; error?: string } {
  const trimmed = value.trim()
  
  if (trimmed.length < minLength) {
    return { isValid: false, error: `${fieldName} en az ${minLength} karakter olmalıdır` }
  }
  
  return { isValid: true }
}

/**
 * Validate postal code (Turkish format)
 */
export function validatePostalCode(postalCode: string): { isValid: boolean; error?: string } {
  const trimmed = postalCode.trim()
  
  if (!trimmed) {
    return { isValid: false, error: 'Posta kodu gereklidir' }
  }
  
  if (!POSTAL_CODE_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Geçerli bir posta kodu giriniz (5 haneli)' }
  }
  
  return { isValid: true }
}

/**
 * Validate complete customer information
 */
export function validateCustomerInfo(info: Partial<CustomerInfo>): ValidationResult {
  const errors: ValidationError[] = []
  
  // First Name
  const firstNameResult = validateRequired(info.firstName || '', 'Ad')
  if (!firstNameResult.isValid) {
    errors.push({ field: 'firstName', message: firstNameResult.error! })
  } else {
    const minLengthResult = validateMinLength(info.firstName || '', 2, 'Ad')
    if (!minLengthResult.isValid) {
      errors.push({ field: 'firstName', message: minLengthResult.error! })
    }
  }
  
  // Last Name
  const lastNameResult = validateRequired(info.lastName || '', 'Soyad')
  if (!lastNameResult.isValid) {
    errors.push({ field: 'lastName', message: lastNameResult.error! })
  } else {
    const minLengthResult = validateMinLength(info.lastName || '', 2, 'Soyad')
    if (!minLengthResult.isValid) {
      errors.push({ field: 'lastName', message: minLengthResult.error! })
    }
  }
  
  // Email
  const emailResult = validateEmail(info.email || '')
  if (!emailResult.isValid) {
    errors.push({ field: 'email', message: emailResult.error! })
  }
  
  // Phone
  const phoneResult = validatePhone(info.phone || '')
  if (!phoneResult.isValid) {
    errors.push({ field: 'phone', message: phoneResult.error! })
  }
  
  // Address
  const addressResult = validateRequired(info.address || '', 'Adres')
  if (!addressResult.isValid) {
    errors.push({ field: 'address', message: addressResult.error! })
  } else {
    const minLengthResult = validateMinLength(info.address || '', 10, 'Adres')
    if (!minLengthResult.isValid) {
      errors.push({ field: 'address', message: minLengthResult.error! })
    }
  }
  
  // City
  const cityResult = validateRequired(info.city || '', 'Şehir')
  if (!cityResult.isValid) {
    errors.push({ field: 'city', message: cityResult.error! })
  }
  
  // Postal Code
  const postalCodeResult = validatePostalCode(info.postalCode || '')
  if (!postalCodeResult.isValid) {
    errors.push({ field: 'postalCode', message: postalCodeResult.error! })
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Get error message for a specific field
 */
export function getFieldError(result: ValidationResult, field: string): string | undefined {
  return result.errors.find(e => e.field === field)?.message
}

/**
 * Check if a specific field has error
 */
export function hasFieldError(result: ValidationResult, field: string): boolean {
  return result.errors.some(e => e.field === field)
}
