'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import { useProductStore } from '@/stores/product-store'
import { calculatePrice } from '@/lib/price-calculator'
import { getCategoryName } from '@/lib/utils'
import { ImageGallery } from '@/components/products/image-gallery'
import { PrintOptionsSelector } from '@/components/products/print-options'
import { PriceDisplay } from '@/components/products/price-display'
import { AddToCart } from '@/components/products/add-to-cart'
import { ProductDetailSkeleton } from '@/components/ui/product-skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { SelectedPrintOptions } from '@/types'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const { products, isLoading, fetchProducts, getProductBySlug } = useProductStore()
  const product = getProductBySlug(slug)

  const [selectedOptions, setSelectedOptions] = useState<SelectedPrintOptions | null>(null)

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
  }, [products.length, fetchProducts])

  // Initialize selected options when product loads
  useEffect(() => {
    if (product && !selectedOptions) {
      const newOptions = {
        sizeId: product.printOptions.sizes[0]?.id || '',
        paperTypeId: product.printOptions.paperTypes[0]?.id || '',
        printSideId: product.printOptions.printSides[0]?.id || '',
        quantity: product.printOptions.quantities[0] || 100,
      }
      // Use setTimeout to avoid setState in effect warning
      const timer = setTimeout(() => {
        setSelectedOptions(newOptions)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [product, selectedOptions])

  // Calculate price based on selected options
  const calculatedPrice = useMemo(() => {
    if (!product || !selectedOptions) return 0

    const size = product.printOptions.sizes.find(s => s.id === selectedOptions.sizeId)
    const paper = product.printOptions.paperTypes.find(p => p.id === selectedOptions.paperTypeId)
    const side = product.printOptions.printSides.find(s => s.id === selectedOptions.printSideId)

    if (!size || !paper || !side) return product.basePrice * selectedOptions.quantity

    return calculatePrice({
      basePrice: product.basePrice,
      sizeMultiplier: size.multiplier,
      paperTypeMultiplier: paper.multiplier,
      printSideMultiplier: side.multiplier,
      quantity: selectedOptions.quantity,
    })
  }, [product, selectedOptions])

  if (isLoading || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductDetailSkeleton />
      </div>
    )
  }

  if (!product) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary transition-colors">
          Ürünler
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link 
          href={`/products?category=${product.category}`}
          className="hover:text-primary transition-colors"
        >
          {getCategoryName(product.category)}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </motion.nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ImageGallery images={product.images} productName={product.name} />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <Badge variant="outline" className="mb-2">
              {getCategoryName(product.category)}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          {/* Print Options */}
          {selectedOptions && (
            <PrintOptionsSelector
              options={product.printOptions}
              selected={selectedOptions}
              onChange={setSelectedOptions}
            />
          )}

          <Separator />

          {/* Price Display */}
          {selectedOptions && (
            <PriceDisplay
              price={calculatedPrice}
              basePrice={product.basePrice}
              quantity={selectedOptions.quantity}
            />
          )}

          {/* Add to Cart */}
          {selectedOptions && (
            <AddToCart product={product} selectedOptions={selectedOptions} />
          )}
        </motion.div>
      </div>
    </div>
  )
}
