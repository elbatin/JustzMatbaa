'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Home, FileText, Printer } from 'lucide-react'
import { useOrderStore } from '@/stores/order-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDate, getOptionName } from '@/lib/utils'
import { PageSkeleton } from '@/components/ui/product-skeleton'
import type { Order } from '@/types'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { getOrderById } = useOrderStore()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId)
      setOrder(foundOrder || null)
    }
  }, [orderId, getOrderById])

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Sipariş Bulunamadı</h1>
        <p className="text-muted-foreground mb-8">
          Aradığınız sipariş bulunamadı veya geçersiz bir bağlantı kullandınız.
        </p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-2"
        >
          Siparişiniz Alındı!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground max-w-md mx-auto"
        >
          Siparişiniz başarıyla oluşturuldu. En kısa sürede hazırlanıp kargoya verilecektir.
        </motion.p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Sipariş Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Sipariş Numarası</p>
                  <p className="font-mono font-semibold text-primary">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sipariş Tarihi</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Durum</p>
                  <p className="font-medium text-yellow-600">Hazırlanıyor</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Tutar</p>
                  <p className="font-bold text-lg text-primary">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sipariş Detayları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {getOptionName(item.product.printOptions.sizes, item.selectedOptions.sizeId)} • 
                          {getOptionName(item.product.printOptions.paperTypes, item.selectedOptions.paperTypeId)} • 
                          {item.selectedOptions.quantity} adet
                        </p>
                      </div>
                      <p className="font-medium">{formatPrice(item.calculatedPrice)}</p>
                    </div>
                    {index < order.items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Teslimat Adresi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {order.customerInfo.firstName} {order.customerInfo.lastName}
              </p>
              <p className="text-muted-foreground">{order.customerInfo.address}</p>
              <p className="text-muted-foreground">
                {order.customerInfo.city}, {order.customerInfo.postalCode}
              </p>
              <p className="text-muted-foreground mt-2">
                {order.customerInfo.phone} • {order.customerInfo.email}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Home className="h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Link href="/products">
            <Button className="w-full sm:w-auto gap-2">
              <Printer className="h-4 w-4" />
              Alışverişe Devam Et
            </Button>
          </Link>
        </motion.div>

        {/* Demo Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Bu bir demo projesidir. Gerçek sipariş veya ödeme işlemi yapılmamıştır.
        </motion.p>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <OrderSuccessContent />
    </Suspense>
  )
}
