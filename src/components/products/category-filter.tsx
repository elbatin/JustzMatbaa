'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProductCategory } from '@/types'

interface CategoryFilterProps {
  currentCategory?: string
}

const categories: { value: string; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'kartvizit', label: 'Kartvizit' },
  { value: 'brosur', label: 'Broşür' },
  { value: 'afis', label: 'Afiş' },
  { value: 'katalog', label: 'Katalog' },
  { value: 'ozel-baski', label: 'Özel Baskı' },
]

export function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('category')
    } else {
      params.set('category', value)
    }
    router.push(`/products?${params.toString()}`)
  }

  const activeCategory = currentCategory || 'all'

  return (
    <>
      {/* Desktop Tabs */}
      <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="hidden md:block">
        <TabsList className="h-auto flex-wrap">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="px-4">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Mobile Select */}
      <div className="md:hidden">
        <Select value={activeCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
