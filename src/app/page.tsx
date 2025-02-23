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
// import { Loader } from "@/components/loader"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"
import { motion } from 'framer-motion'

const categories = [0, 1, 2, 3]

const slideIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const { ref, inView } = useInView()
  const [selectedCategory, setSelectedCategory] = useState<number>(0) // Default to 'All'
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Add search event listener
  useEffect(() => {
    const handleSearchEvent = (event: CustomEvent<string>) => {
      setSearchTerm(event.detail);
    };

    window.addEventListener('product-search', handleSearchEvent as EventListener);

    return () => {
      window.removeEventListener('product-search', handleSearchEvent as EventListener);
    };
  }, []);

  // Add URL search param handler
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['products', selectedCategory, searchTerm],
    queryFn: ({ pageParam = 1 }) => getPublicProducts(pageParam, 8, selectedCategory, searchTerm),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

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
                variant={selectedCategory === category ? "default" : "outline"}
                className="rounded-full whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 0 ? "All" : `Category ${category}`}
              </Button>
            ))}
          </div>

          {status === 'pending' ? (
            <div className="space-y-8">
              {/* <div className="flex justify-center">
                <Loader size="lg" />
              </div> */}
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
                  <motion.div
                    key={product.id}
                    variants={slideIn}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5 }}
                  >
                    <ProductCard
                      product={{
                        id: product.id.toString(),
                        name: product.nom,
                        price: product.prix,
                        image: product.imageURL,
                        category: `Category ${product.categorieID}`
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Loading indicator and observer target */}
              <div ref={ref} className="mt-8">
                {isFetchingNextPage && (
                  <div className="space-y-8">
                    {/* <div className="flex justify-center">
                      <Loader size="lg" />
                    </div> */}
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
