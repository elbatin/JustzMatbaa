'use client'

import { motion } from 'framer-motion'
import { useOrderStore } from '@/stores/order-store'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDate, getOptionName } from '@/lib/utils'
import { EmptyOrders } from '@/components/ui/empty-state'
import { Eye } from 'lucide-react'
import type { Order } from '@/types'

function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const variants: Record<Order['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Beklemede', variant: 'secondary' },
    processing: { label: 'Hazırlanıyor', variant: 'default' },
    completed: { label: 'Tamamlandı', variant: 'outline' },
    cancelled: { label: 'İptal', variant: 'destructive' },
  }
  
  const { label, variant } = variants[status]
  return <Badge variant={variant}>{label}</Badge>
}

export default function AdminOrdersPage() {
  const { orders } = useOrderStore()

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Siparişler</h1>
        <p className="text-muted-foreground">{orders.length} sipariş</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border rounded-lg"
      >
        {orders.length === 0 ? (
          <div className="p-8">
            <EmptyOrders />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sipariş No</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {order.customerInfo.firstName} {order.customerInfo.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerInfo.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Sipariş Detayı</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Sipariş No</p>
                              <p className="font-mono font-medium">{order.orderNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Tarih</p>
                              <p className="font-medium">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Müşteri Bilgileri</p>
                            <p className="font-medium">
                              {order.customerInfo.firstName} {order.customerInfo.lastName}
                            </p>
                            <p className="text-sm">{order.customerInfo.email}</p>
                            <p className="text-sm">{order.customerInfo.phone}</p>
                            <p className="text-sm mt-2">{order.customerInfo.address}</p>
                            <p className="text-sm">
                              {order.customerInfo.city}, {order.customerInfo.postalCode}
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Ürünler</p>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between p-2 bg-muted rounded">
                                  <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {getOptionName(item.product.printOptions.sizes, item.selectedOptions.sizeId)} • 
                                      {item.selectedOptions.quantity} adet
                                    </p>
                                  </div>
                                  <p className="font-medium">{formatPrice(item.calculatedPrice)}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div className="flex justify-between text-lg font-bold">
                            <span>Toplam</span>
                            <span className="text-primary">{formatPrice(order.totalAmount)}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  )
}
