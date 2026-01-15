'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, FileText, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrderStore } from '@/stores/order-store'
import { useProductStore } from '@/stores/product-store'
import { useLanguageStore } from '@/stores/language-store'
import { formatPrice } from '@/lib/utils'

export default function AdminDashboardPage() {
  const { orders, getTotalOrdersCount, getTotalRevenue, getBestSellingProduct } = useOrderStore()
  const { products, fetchProducts } = useProductStore()
  const { t } = useLanguageStore()

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
  }, [products.length, fetchProducts])

  const totalOrders = getTotalOrdersCount()
  const totalRevenue = getTotalRevenue()
  const bestSelling = getBestSellingProduct()

  const stats = [
    {
      title: t.admin.totalOrders,
      value: totalOrders.toString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: t.admin.totalRevenue,
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: t.admin.totalProducts,
      value: products.length.toString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: t.admin.bestSelling,
      value: bestSelling?.productName || '-',
      subtitle: bestSelling ? `${bestSelling.quantity} ${t.common.pieces}` : undefined,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">{t.admin.dashboard}</h1>
        <p className="text-muted-foreground">{t.admin.welcome}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t.admin.recentOrders}</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {t.admin.noOrders}
              </p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerInfo.firstName} {order.customerInfo.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} {t.cart.items}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
