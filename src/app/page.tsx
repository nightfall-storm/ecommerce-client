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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

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
    <motion.div
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      <main className="flex-1">
        <Hero />

        <section className="container mx-auto px-4 py-16 max-w-7xl">
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="hidden md:flex">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {categories.map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="rounded-full whitespace-nowrap"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 0 ? "All" : `Category ${category}`}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {status === 'pending' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : status === 'error' ? (
            <motion.div
              className="text-center text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p>Error loading products. Please try again later.</p>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
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
              </motion.div>

              <div ref={ref} className="mt-8">
                {isFetchingNextPage && (
                  <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {[...Array(4)].map((_, index) => (
                        <motion.div
                          key={index}
                          className="space-y-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Skeleton className="h-[200px] w-full" />
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </section>

        <motion.section
          className="container mx-auto px-4 py-16 max-w-7xl border-t"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { title: "Free Shipping", desc: "On orders over $50" },
              { title: "Secure Payment", desc: "100% secure payment" },
              { title: "24/7 Support", desc: "Dedicated support" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
      <Footer />
    </motion.div>
  )
}
