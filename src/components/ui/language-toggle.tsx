'use client'

import * as React from 'react'
import { Languages } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguageStore } from '@/stores/language-store'

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguageStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Languages className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-1.5 px-2">
          <Languages className="h-4 w-4" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={locale}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-medium uppercase"
            >
              {locale}
            </motion.span>
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLocale('tr')}
          className={locale === 'tr' ? 'bg-accent' : ''}
        >
          <span className="mr-2">🇹🇷</span>
          {t.language.tr}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLocale('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          <span className="mr-2">🇬🇧</span>
          {t.language.en}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple toggle button without dropdown
export function LanguageToggleSimple() {
  const { locale, toggleLocale } = useLanguageStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-9 px-2">
        <span className="text-xs font-medium">TR</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 px-2 min-w-[40px] relative overflow-hidden"
      onClick={toggleLocale}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={locale}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-xs font-medium uppercase absolute"
        >
          {locale === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
