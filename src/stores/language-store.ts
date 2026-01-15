/**
 * Language Store - Zustand with localStorage persistence
 * 
 * Manages language/locale state with persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { translations, type Locale, type TranslationKeys } from '@/lib/i18n'

interface LanguageStore {
  locale: Locale
  t: TranslationKeys
  
  // Actions
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      locale: 'tr' as Locale,
      t: translations.tr,

      setLocale: (locale: Locale) => {
        set({ 
          locale, 
          t: translations[locale]
        })
      },

      toggleLocale: () => {
        const currentLocale = get().locale
        const newLocale: Locale = currentLocale === 'tr' ? 'en' : 'tr'
        set({ 
          locale: newLocale, 
          t: translations[newLocale]
        })
      },
    }),
    {
      name: 'justz-matbaa-language',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.locale]
        }
      },
    }
  )
)
