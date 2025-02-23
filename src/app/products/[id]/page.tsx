"use client"

import { useQuery } from "@tanstack/react-query"
import { getProduct } from "@/services/products"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useCartStore } from "@/lib/store/cart"
import { toast } from "sonner"
import { Loader } from "@/components/loader"
import { motion } from "framer-motion"

export default function ProductPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(parseInt(id || '')),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.nom,
        price: product.prix,
        quantity: quantity,
        image: product.imageURL,
        stock: product.stock
      })
      toast.success('Added to cart')
    }
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  if (!id) {
    return (
      <motion.div
        className="flex min-h-screen flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <motion.div
            className="text-center text-red-500"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>Product not found.</p>
          </motion.div>
        </main>
        <Footer />
      </motion.div>
    )
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <motion.div
            className="h-[400px]"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Loader size="lg" className="h-full" />
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-center text-red-500"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>Error loading product. Please try again later.</p>
          </motion.div>
        ) : product ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative aspect-square"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={product.imageURL}
                alt={product.nom}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <motion.h1
                  className="text-3xl font-bold"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {product.nom}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Badge variant="secondary" className="mt-2">
                    Category {product.categorieID}
                  </Badge>
                </motion.div>
              </div>

              <motion.p
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                ${product.prix}
              </motion.p>

              <motion.div
                className="prose max-w-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p className="text-muted-foreground">{product.description}</p>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <p className="text-sm text-muted-foreground">
                  Stock disponible: {product.stock}
                </p>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="flex items-center border rounded-md">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <span className="w-12 text-center">{quantity}</span>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </main>
      <Footer />
    </motion.div>
  )
}