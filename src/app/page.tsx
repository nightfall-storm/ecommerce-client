"use client"

import { Header } from "@/components/ui/header"
import { Hero } from "@/components/ui/hero"
import { ProductCard } from "@/components/ui/product-card"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getProducts } from "@/services/products"
import { Skeleton } from "@/components/ui/skeleton"

const categories = ["All", "Electronics", "Sports", "Accessories", "Fashion"]

export default function Home() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const data = await getProducts()
        return data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },
    retry: false
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />

        <section className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <Button variant="outline" className="hidden md:flex">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className="rounded-full whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-[200px] w-full" />
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>Error loading products. Please try again later.</p>
              <p className="text-sm mt-2">{(error as Error).message}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id.toString(),
                    name: product.nom,
                    price: product.prix,
                    image: product.imageURL || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
                    category: `Category ${product.categorieID}`
                  }}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button size="lg">Load More</Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 max-w-7xl border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">On orders over $50</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">100% secure payment</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">Dedicated support</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
