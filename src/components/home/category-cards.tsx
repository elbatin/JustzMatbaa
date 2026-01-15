'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CreditCard, FileText, Image, BookOpen, Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguageStore } from '@/stores/language-store'
import type { ProductCategory } from '@/types'

interface CategoryItem {
  id: ProductCategory
  nameKey: 'businessCard' | 'brochure' | 'poster' | 'catalog' | 'flyer'
  descriptionKey: string
  icon: React.ElementType
  color: string
}

const categoryItems: CategoryItem[] = [
  {
    id: 'kartvizit',
    nameKey: 'businessCard',
    descriptionKey: 'businessCardDesc',
    icon: CreditCard,
    color: 'from-blue-500/20 to-blue-600/20',
  },
  {
    id: 'brosur',
    nameKey: 'brochure',
    descriptionKey: 'brochureDesc',
    icon: FileText,
    color: 'from-green-500/20 to-green-600/20',
  },
  {
    id: 'afis',
    nameKey: 'poster',
    descriptionKey: 'posterDesc',
    icon: Image,
    color: 'from-purple-500/20 to-purple-600/20',
  },
  {
    id: 'katalog',
    nameKey: 'catalog',
    descriptionKey: 'catalogDesc',
    icon: BookOpen,
    color: 'from-orange-500/20 to-orange-600/20',
  },
  {
    id: 'ozel-baski',
    nameKey: 'flyer',
    descriptionKey: 'flyerDesc',
    icon: Sparkles,
    color: 'from-pink-500/20 to-pink-600/20',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function CategoryCards() {
  const { t } = useLanguageStore()
  
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">{t.categories.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.categories.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {categoryItems.map((category) => {
            const Icon = category.icon
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link href={`/products?category=${category.id}`}>
                  <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-foreground" />
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {t.categories[category.nameKey]}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t.categories.subtitle}
                      </p>
                      <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{t.products.viewDetails}</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
