'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Search } from 'lucide-react'
import { useProductStore } from '@/stores/product-store'
import { useLanguageStore } from '@/stores/language-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatPrice, getCategoryName } from '@/lib/utils'
import { EmptyProducts } from '@/components/ui/empty-state'
import { toast } from 'sonner'

export default function AdminProductsPage() {
  const { products, isLoading, fetchProducts, deleteProduct, searchProducts } = useProductStore()
  const { t } = useLanguageStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
  }, [products.length, fetchProducts])

  const filteredProducts = searchQuery 
    ? searchProducts(searchQuery)
    : products

  const handleDelete = (id: string) => {
    deleteProduct(id)
    setDeleteId(null)
    toast.success(t.admin.productDeleted)
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">{t.admin.products}</h1>
          <p className="text-muted-foreground">{products.length} {t.cart.items}</p>
        </div>
        <Button className="gap-2" disabled>
          <Plus className="h-4 w-4" />
          {t.admin.newProduct}
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.admin.searchProducts}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border rounded-lg"
      >
        {filteredProducts.length === 0 ? (
          <div className="p-8">
            <EmptyProducts />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.products}</TableHead>
                <TableHead>{t.admin.category}</TableHead>
                <TableHead>{t.admin.price}</TableHead>
                <TableHead>{t.admin.status}</TableHead>
                <TableHead className="text-right">{t.admin.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {product.shortDescription}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryName(product.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatPrice(product.basePrice)}</TableCell>
                  <TableCell>
                    {product.featured ? (
                      <Badge>{t.admin.featured}</Badge>
                    ) : (
                      <Badge variant="secondary">{t.admin.normal}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={deleteId === product.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t.admin.deleteProduct}</DialogTitle>
                          <DialogDescription>
                            &quot;{product.name}&quot; {t.admin.deleteConfirm}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteId(null)}>
                            {t.admin.cancel}
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleDelete(product.id)}
                          >
                            {t.admin.delete}
                          </Button>
                        </DialogFooter>
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
