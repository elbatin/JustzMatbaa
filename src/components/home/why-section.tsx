'use client'

import { motion } from 'framer-motion'
import { Truck, Award, Clock, HeadphonesIcon, Palette, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguageStore } from '@/stores/language-store'

const featureIcons = [Award, Truck, Clock, Palette, ShieldCheck, HeadphonesIcon]

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

export function WhySection() {
  const { t } = useLanguageStore()
  
  const features = [
    { icon: Award, title: t.why.quality, description: t.why.qualityDesc },
    { icon: Truck, title: t.why.fast, description: t.why.fastDesc },
    { icon: Clock, title: t.why.support, description: t.why.supportDesc },
    { icon: Palette, title: t.why.price, description: t.why.priceDesc },
    { icon: ShieldCheck, title: t.why.quality, description: t.why.qualityDesc },
    { icon: HeadphonesIcon, title: t.why.support, description: t.why.supportDesc },
  ]
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">{t.why.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.why.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.slice(0, 4).map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
