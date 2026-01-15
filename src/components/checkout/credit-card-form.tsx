'use client'

import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useLanguageStore } from '@/stores/language-store'

interface CreditCardFormProps {
  onSubmit: () => void
  isLoading?: boolean
}

export function CreditCardForm({ onSubmit, isLoading }: CreditCardFormProps) {
  const { t } = useLanguageStore()
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t.checkout.paymentInfo}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Lock className="h-3 w-3" />
          {t.checkout.demoNotice}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">{t.checkout.cardName}</Label>
            <Input
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder={t.checkout.cardName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">{t.checkout.cardNumber}</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                required
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">{t.checkout.expiry}</Label>
              <Input
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="AA/YY"
                maxLength={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">{t.checkout.cvv}</Label>
              <Input
                id="cvv"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="***"
                maxLength={3}
                required
              />
            </div>
          </div>

          {/* Fake Card Preview */}
          <div className="mt-6 p-4 bg-gradient-to-br from-primary to-primary/80 rounded-lg text-primary-foreground">
            <div className="flex justify-between items-start mb-8">
              <div className="w-10 h-7 bg-yellow-400/80 rounded" />
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="font-mono text-lg tracking-wider mb-4">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-xs opacity-70">{t.checkout.cardName}</div>
                <div>{cardName || t.checkout.cardName}</div>
              </div>
              <div>
                <div className="text-xs opacity-70">{t.checkout.expiry}</div>
                <div>{expiry || 'AA/YY'}</div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? t.checkout.processing : t.checkout.completePayment}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
