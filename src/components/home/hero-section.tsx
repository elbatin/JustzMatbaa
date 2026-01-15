'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Profesyonel Baskı Çözümleri
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              İşinizi{' '}
              <span className="text-primary">Bir Adım</span>{' '}
              Öne Taşıyın
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Kartvizit, broşür, afiş ve daha fazlası. Kaliteli malzeme, 
              hızlı teslimat ve uygun fiyatlarla profesyonel baskı hizmetleri.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Ürünleri Keşfet
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?category=kartvizit">
                <Button size="lg" variant="outline">
                  Kartvizit Tasarla
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-5 w-5 text-primary" />
                <span>Hızlı Teslimat</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>Kalite Garantisi</span>
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square">
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 w-48 h-28 bg-white rounded-lg shadow-xl border p-4"
              >
                <div className="h-2 w-20 bg-primary/20 rounded mb-2" />
                <div className="h-2 w-32 bg-muted rounded mb-2" />
                <div className="h-2 w-24 bg-muted rounded" />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">Kartvizit</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-32 right-0 w-56 h-72 bg-white rounded-lg shadow-xl border p-4"
              >
                <div className="h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded mb-3" />
                <div className="h-2 w-full bg-muted rounded mb-2" />
                <div className="h-2 w-3/4 bg-muted rounded mb-2" />
                <div className="h-2 w-1/2 bg-muted rounded" />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">Broşür</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-20 w-40 h-56 bg-white rounded-lg shadow-xl border p-3"
              >
                <div className="h-32 bg-gradient-to-br from-accent/20 to-primary/20 rounded mb-2" />
                <div className="h-2 w-full bg-muted rounded mb-1" />
                <div className="h-2 w-2/3 bg-muted rounded" />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">Afiş</div>
              </motion.div>

              {/* Background Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
