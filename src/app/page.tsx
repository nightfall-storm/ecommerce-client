"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getPublicProducts } from "@/services/products"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader } from "@/components/loader"
import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from "next/navigation"

const categories = ["All", "Electronics", "Sports", "Accessories", "Fashion"]

export default function Home() {
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    // You can add additional token validation here if needed
  }, [])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => getPublicProducts(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined
    },
    initialPageParam: 1,
  })

  // Intersection Observer setup
  const observerTarget = useRef<HTMLDivElement>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = observerTarget.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    })

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [handleObserver])

  // Flatten all products from all pages
  const products = data?.pages.flatMap(page => page.items) ?? []

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

          {status === 'pending' ? (
            <div className="space-y-8">
              <div className="flex justify-center">
                <Loader size="lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="space-y-4">
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                ))}
              </div>
            </div>
          ) : status === 'error' ? (
            <div className="text-center text-red-500">
              <p>Error loading products. Please try again later.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id.toString(),
                      name: product.nom,
                      price: product.prix,
                      image: product.imageURL,
                      category: `Category ${product.categorieID}`
                    }}
                  />
                ))}
              </div>

              {/* Loading indicator and observer target */}
              <div ref={observerTarget} className="mt-8">
                {isFetchingNextPage && (
                  <div className="space-y-8">
                    <div className="flex justify-center">
                      <Loader size="lg" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="space-y-4">
                          <Skeleton className="h-[200px] w-full" />
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
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
