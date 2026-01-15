'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { validateEmail, validatePhone } from '@/lib/validators'
import type { CustomerInfo } from '@/types'

interface CustomerFormProps {
  onSubmit: (data: CustomerInfo) => void
  isLoading?: boolean
}

export function CustomerForm({ onSubmit, isLoading }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInfo>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teslimat Bilgileri</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad *</Label>
              <Input
                id="firstName"
                {...register('firstName', { 
                  required: 'Ad gerekli',
                  minLength: { value: 2, message: 'En az 2 karakter' }
                })}
                placeholder="Adınız"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad *</Label>
              <Input
                id="lastName"
                {...register('lastName', { 
                  required: 'Soyad gerekli',
                  minLength: { value: 2, message: 'En az 2 karakter' }
                })}
                placeholder="Soyadınız"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta *</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'E-posta gerekli',
                validate: (value) => {
                  const result = validateEmail(value)
                  return result.isValid || result.error || 'Geçerli bir e-posta girin'
                }
              })}
              placeholder="ornek@email.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon *</Label>
            <Input
              id="phone"
              {...register('phone', { 
                required: 'Telefon gerekli',
                validate: (value) => {
                  const result = validatePhone(value)
                  return result.isValid || result.error || 'Geçerli bir telefon numarası girin'
                }
              })}
              placeholder="05XX XXX XX XX"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adres *</Label>
            <Textarea
              id="address"
              {...register('address', { 
                required: 'Adres gerekli',
                minLength: { value: 10, message: 'En az 10 karakter' }
              })}
              placeholder="Teslimat adresi"
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Şehir *</Label>
              <Input
                id="city"
                {...register('city', { required: 'Şehir gerekli' })}
                placeholder="İstanbul"
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Posta Kodu *</Label>
              <Input
                id="postalCode"
                {...register('postalCode', { 
                  required: 'Posta kodu gerekli',
                  pattern: { value: /^\d{5}$/, message: '5 haneli posta kodu girin' }
                })}
                placeholder="34000"
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'İşleniyor...' : 'Ödemeye Geç'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
