/**
 * JustzMatbaa Logger Utility
 * 
 * Logs key actions for debugging and analytics
 */

import type { LogActionType, LogEntry } from '@/types'
import { generateId } from './utils'

// In-memory log storage (for demo purposes)
const logs: LogEntry[] = []

// Maximum logs to keep in memory
const MAX_LOGS = 100

/**
 * Log an action
 */
export function logAction(
  action: LogActionType, 
  data?: Record<string, unknown>
): LogEntry {
  const entry: LogEntry = {
    id: generateId(),
    action,
    timestamp: new Date().toISOString(),
    data,
  }
  
  // Add to logs
  logs.unshift(entry)
  
  // Keep only last MAX_LOGS entries
  if (logs.length > MAX_LOGS) {
    logs.pop()
  }
  
  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${entry.timestamp}] ${action}`, data || '')
  }
  
  return entry
}

/**
 * Get all logs
 */
export function getLogs(): LogEntry[] {
  return [...logs]
}

/**
 * Get logs by action type
 */
export function getLogsByAction(action: LogActionType): LogEntry[] {
  return logs.filter(log => log.action === action)
}

/**
 * Clear all logs
 */
export function clearLogs(): void {
  logs.length = 0
}

/**
 * Get recent logs (last n entries)
 */
export function getRecentLogs(count: number = 10): LogEntry[] {
  return logs.slice(0, count)
}

// Convenience functions for common actions
export const logger = {
  addToCart: (productId: string, quantity: number) => 
    logAction('ADD_TO_CART', { productId, quantity }),
    
  removeFromCart: (productId: string) => 
    logAction('REMOVE_FROM_CART', { productId }),
    
  updateCartQuantity: (productId: string, quantity: number) => 
    logAction('UPDATE_CART_QUANTITY', { productId, quantity }),
    
  checkoutStart: (cartTotal: number, itemCount: number) => 
    logAction('CHECKOUT_START', { cartTotal, itemCount }),
    
  checkoutComplete: (orderId: string, orderNumber: string, total: number) => 
    logAction('CHECKOUT_COMPLETE', { orderId, orderNumber, total }),
    
  adminAddProduct: (productId: string, productName: string) => 
    logAction('ADMIN_ADD_PRODUCT', { productId, productName }),
    
  adminDeleteProduct: (productId: string, productName: string) => 
    logAction('ADMIN_DELETE_PRODUCT', { productId, productName }),
    
  adminLogin: (userId: string, email: string) => 
    logAction('ADMIN_LOGIN', { userId, email }),
    
  adminLogout: (userId: string) => 
    logAction('ADMIN_LOGOUT', { userId }),
}
