"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useQuery } from "@tanstack/react-query"
import { getOrderDetails } from "@/services/orders"
import { formatPrice } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { use } from "react"

interface OrderPageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderPage({ params }: OrderPageProps) {
  const { id } = use(params)

  const { data: orderDetails, isLoading, error } = useQuery({
    queryKey: ['orderDetails', id],
    queryFn: () => getOrderDetails(parseInt(id)),
    enabled: !!id
  })

  if (!id) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            <p>Order not found.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            <p>Error loading order. Please try again later.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Order Details</h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : orderDetails && orderDetails.length > 0 ? (
            <div className="space-y-8">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Order #{id}</h2>
                <div className="space-y-6">
                  {orderDetails.map((detail) => (
                    <div key={detail.id} className="flex items-center gap-4">
                      <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                        <Image
                          src={detail.product.imageURL}
                          alt={detail.product.nom || `Product #${detail.produitID}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{detail.product.nom || `Product #${detail.produitID}`}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {detail.quantite}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(detail.prixUnitaire * detail.quantite)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">
                    {formatPrice(
                      orderDetails.reduce(
                        (total, detail) => total + detail.prixUnitaire * detail.quantite,
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No order details found.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}