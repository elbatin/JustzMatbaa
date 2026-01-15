'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft, Package } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useOrderStore } from '@/stores/order-store'
import { useLanguageStore } from '@/stores/language-store'
import { CustomerForm } from '@/components/checkout/customer-form'
import { CreditCardForm } from '@/components/checkout/credit-card-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { EmptyCart } from '@/components/ui/empty-state'
import { formatPrice } from '@/lib/utils'
import { delay } from '@/lib/utils'
import { logger } from '@/lib/logger'
import type { CustomerInfo } from '@/types'
import Link from 'next/link'

type CheckoutStep = 'customer' | 'payment' | 'processing'

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState<CheckoutStep>('customer')
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguageStore()

  const { items, getTotalAmount, clearCart } = useCartStore()
  const { createOrder } = useOrderStore()

  const totalAmount = getTotalAmount()

  const handleCustomerSubmit = (data: CustomerInfo) => {
    setCustomerInfo(data)
    setStep('payment')
    logger.checkoutStart(totalAmount, items.length)
  }

  const handlePaymentSubmit = async () => {
    if (!customerInfo) return

    setIsLoading(true)
    setStep('processing')

    // Simulate payment processing
    await delay(2000)

    // Create order
    const order = createOrder(items, customerInfo, totalAmount)
    
    // Clear cart
    clearCart()

    // Redirect to success page
    router.push(`/order-success?orderId=${order.id}`)
  }

  if (items.length === 0 && step !== 'processing') {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link href="/cart">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t.checkout.backToCart}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t.checkout.title}</h1>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-4 mb-8"
      >
        {['customer', 'payment', 'processing'].map((s, index) => (
          <div key={s} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step === s ? 'bg-primary text-primary-foreground' : 
                ['customer', 'payment', 'processing'].indexOf(step) > index 
                  ? 'bg-green-500 text-white' 
                  : 'bg-muted text-muted-foreground'}
            `}>
              {['customer', 'payment', 'processing'].indexOf(step) > index ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < 2 && (
              <div className={`w-12 h-0.5 mx-2 ${
                ['customer', 'payment', 'processing'].indexOf(step) > index 
                  ? 'bg-green-500' 
                  : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 'customer' && (
              <motion.div
                key="customer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <CustomerForm onSubmit={handleCustomerSubmit} />
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mb-4"
                  onClick={() => setStep('customer')}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t.checkout.editInfo}
                </Button>
                <CreditCardForm onSubmit={handlePaymentSubmit} isLoading={isLoading} />
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t.checkout.processing}</h2>
                <p className="text-muted-foreground">{t.checkout.pleaseWait}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t.cart.orderSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.selectedOptions.quantity} {t.common.pieces}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.calculatedPrice)}</p>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.cart.subtotal}</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.cart.shipping}</span>
                  <span className="text-green-600">{t.cart.free}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>{t.cart.total}</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
