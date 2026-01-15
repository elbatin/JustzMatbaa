/**
 * Feature: justz-matbaa-ecommerce
 * Property 11: Role-Based Access Control
 * Validates: Requirements 11.2, 11.3
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore, mockUsers, mockPasswords } from '../auth-store'

describe('Auth Store - Property Tests', () => {
  beforeEach(() => {
    useAuthStore.setState({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false, 
      error: null 
    })
  })

  /**
   * Property 11: Admin users should have admin role
   */
  it('should correctly identify admin users', async () => {
    const adminUser = mockUsers.find(u => u.role === 'admin')!
    const adminPassword = mockPasswords[adminUser.email]
    
    await useAuthStore.getState().login(adminUser.email, adminPassword)
    
    expect(useAuthStore.getState().isAdmin()).toBe(true)
    expect(useAuthStore.getState().getRole()).toBe('admin')
  })

  /**
   * Property 11: Non-admin users should not have admin role
   */
  it('should correctly identify non-admin users', async () => {
    const normalUser = mockUsers.find(u => u.role === 'user')!
    const userPassword = mockPasswords[normalUser.email]
    
    await useAuthStore.getState().login(normalUser.email, userPassword)
    
    expect(useAuthStore.getState().isAdmin()).toBe(false)
    expect(useAuthStore.getState().getRole()).toBe('user')
  })

  /**
   * Property: Unauthenticated users should not have admin access
   */
  it('should deny admin access to unauthenticated users', () => {
    expect(useAuthStore.getState().isAdmin()).toBe(false)
    expect(useAuthStore.getState().getRole()).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  /**
   * Property: Logout should remove all access
   */
  it('should remove all access on logout', async () => {
    const adminUser = mockUsers.find(u => u.role === 'admin')!
    const adminPassword = mockPasswords[adminUser.email]
    
    await useAuthStore.getState().login(adminUser.email, adminPassword)
    expect(useAuthStore.getState().isAdmin()).toBe(true)
    
    useAuthStore.getState().logout()
    
    expect(useAuthStore.getState().isAdmin()).toBe(false)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })
})

describe('Auth Store - Unit Tests', () => {
  beforeEach(() => {
    useAuthStore.setState({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false, 
      error: null 
    })
  })

  it('should login with correct credentials', async () => {
    const result = await useAuthStore.getState().login('admin@justzmatbaa.com', 'admin123')
    
    expect(result).toBe(true)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().user).not.toBeNull()
  })

  it('should fail login with wrong password', async () => {
    const result = await useAuthStore.getState().login('admin@justzmatbaa.com', 'wrongpassword')
    
    expect(result).toBe(false)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().error).toBe('Şifre hatalı')
  })

  it('should fail login with non-existent user', async () => {
    const result = await useAuthStore.getState().login('nonexistent@example.com', 'password')
    
    expect(result).toBe(false)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().error).toBe('Kullanıcı bulunamadı')
  })

  it('should clear error', async () => {
    await useAuthStore.getState().login('admin@justzmatbaa.com', 'wrongpassword')
    expect(useAuthStore.getState().error).not.toBeNull()
    
    useAuthStore.getState().clearError()
    expect(useAuthStore.getState().error).toBeNull()
  })

  it('should handle case-insensitive email', async () => {
    const result = await useAuthStore.getState().login('ADMIN@JUSTZMATBAA.COM', 'admin123')
    
    expect(result).toBe(true)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })
})
