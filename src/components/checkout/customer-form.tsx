'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { validateEmail, validatePhone } from '@/lib/validators'
import { useLanguageStore } from '@/stores/language-store'
import type { CustomerInfo } from '@/types'

interface CustomerFormProps {
  onSubmit: (data: CustomerInfo) => void
  isLoading?: boolean
}

export function CustomerForm({ onSubmit, isLoading }: CustomerFormProps) {
  const { t } = useLanguageStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInfo>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.checkout.deliveryInfo}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t.checkout.firstName} *</Label>
              <Input
                id="firstName"
                {...register('firstName', { 
                  required: `${t.checkout.firstName} required`,
                  minLength: { value: 2, message: 'Min 2 characters' }
                })}
                placeholder={t.checkout.firstName}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t.checkout.lastName} *</Label>
              <Input
                id="lastName"
                {...register('lastName', { 
                  required: `${t.checkout.lastName} required`,
                  minLength: { value: 2, message: 'Min 2 characters' }
                })}
                placeholder={t.checkout.lastName}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t.checkout.email} *</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: `${t.checkout.email} required`,
                validate: (value) => {
                  const result = validateEmail(value)
                  return result.isValid || result.error || 'Invalid email'
                }
              })}
              placeholder="ornek@email.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t.checkout.phone} *</Label>
            <Input
              id="phone"
              {...register('phone', { 
                required: `${t.checkout.phone} required`,
                validate: (value) => {
                  const result = validatePhone(value)
                  return result.isValid || result.error || 'Invalid phone'
                }
              })}
              placeholder="05XX XXX XX XX"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t.checkout.address} *</Label>
            <Textarea
              id="address"
              {...register('address', { 
                required: `${t.checkout.address} required`,
                minLength: { value: 10, message: 'Min 10 characters' }
              })}
              placeholder={t.checkout.address}
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">{t.checkout.city} *</Label>
              <Input
                id="city"
                {...register('city', { required: `${t.checkout.city} required` })}
                placeholder={t.checkout.city}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">{t.checkout.postalCode} *</Label>
              <Input
                id="postalCode"
                {...register('postalCode', { 
                  required: `${t.checkout.postalCode} required`,
                  pattern: { value: /^\d{5}$/, message: '5 digit postal code' }
                })}
                placeholder="34000"
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t.common.loading : t.checkout.proceedToPayment}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
