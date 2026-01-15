'use client'

import { motion } from 'framer-motion'
import { Truck, Award, Clock, HeadphonesIcon, Palette, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Award,
    title: 'Premium Kalite',
    description: 'En kaliteli malzemeler ve son teknoloji baskı makineleri ile üretim.',
  },
  {
    icon: Truck,
    title: 'Hızlı Teslimat',
    description: 'Siparişleriniz en kısa sürede kapınıza teslim edilir.',
  },
  {
    icon: Clock,
    title: '7/24 Sipariş',
    description: 'İstediğiniz zaman online sipariş verebilirsiniz.',
  },
  {
    icon: Palette,
    title: 'Özel Tasarım',
    description: 'Kendi tasarımınızı yükleyin veya profesyonel destek alın.',
  },
  {
    icon: ShieldCheck,
    title: 'Güvenli Ödeme',
    description: '256-bit SSL şifreleme ile güvenli alışveriş.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Müşteri Desteği',
    description: 'Sorularınız için her zaman yanınızdayız.',
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

export function WhySection() {
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
          <h2 className="text-3xl font-bold mb-4">Neden JustzMatbaa?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Yılların deneyimi ve müşteri memnuniyeti odaklı yaklaşımımızla 
            baskı ihtiyaçlarınız için en doğru adrestesiniz.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
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
