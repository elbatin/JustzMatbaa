/**
 * Auth Store - Zustand with localStorage persistence
 * 
 * Manages authentication state with mock users
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, UserRole } from '@/types'
import { logger } from '@/lib/logger'

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: 'user_admin',
    email: 'admin@justzmatbaa.com',
    name: 'Admin Kullanıcı',
    role: 'admin',
  },
  {
    id: 'user_demo',
    email: 'demo@justzmatbaa.com',
    name: 'Demo Kullanıcı',
    role: 'user',
  },
]

// Mock passwords (in real app, this would be hashed and on server)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@justzmatbaa.com': 'admin123',
  'demo@justzmatbaa.com': 'demo123',
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: () => boolean
  getRole: () => UserRole | null
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Find user
        const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
        
        if (!user) {
          set({ isLoading: false, error: 'Kullanıcı bulunamadı' })
          return false
        }
        
        // Check password
        if (MOCK_PASSWORDS[user.email] !== password) {
          set({ isLoading: false, error: 'Şifre hatalı' })
          return false
        }
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null,
        })
        
        if (user.role === 'admin') {
          logger.adminLogin(user.id, user.email)
        }
        
        return true
      },

      logout: () => {
        const user = get().user
        
        if (user?.role === 'admin') {
          logger.adminLogout(user.id)
        }
        
        set({ 
          user: null, 
          isAuthenticated: false,
          error: null,
        })
      },

      isAdmin: () => {
        return get().user?.role === 'admin'
      },

      getRole: () => {
        return get().user?.role ?? null
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'justz-matbaa-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

// Export mock users for testing
export const mockUsers = MOCK_USERS
export const mockPasswords = MOCK_PASSWORDS
