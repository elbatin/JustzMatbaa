'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cart-store'
import { useLanguageStore } from '@/stores/language-store'
import { formatPrice } from '@/lib/utils'

export function CartSummary() {
  const { items, getTotalAmount } = useCartStore()
  const { t } = useLanguageStore()
  const totalAmount = getTotalAmount()
  const itemCount = items.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.cart.orderSummary}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t.cart.productCount}</span>
          <span>{itemCount} {t.cart.items}</span>
        </div>
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

        {/* Trust Badges */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span>{t.cart.securePayment}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-4 w-4 text-primary" />
            <span>{t.cart.fastDelivery}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/checkout" className="w-full">
          <Button className="w-full gap-2" size="lg" disabled={itemCount === 0}>
            {t.cart.checkout}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
