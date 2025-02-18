"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useQuery } from "@tanstack/react-query"
import { getOrderDetails } from "@/services/orders"
import { formatPrice } from "@/lib/utils"
import { Loader2, Package, Calendar, Clock, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { use } from "react"
import { Badge } from "@/components/ui/badge"

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
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Order Details</h1>
            <Badge variant="outline" className="px-4 py-1 text-base">
              Order #{id}
            </Badge>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : orderDetails && orderDetails.length > 0 ? (
            <div className="space-y-8">
              {/* Order Status Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg p-6 shadow-sm border flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">Processing</p>
                  </div>
                </div>
                <div className="bg-card rounded-lg p-6 shadow-sm border flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-card rounded-lg p-6 shadow-sm border flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">2-4 Business Days</p>
                  </div>
                </div>
              </div>

              {/* Order Items Card */}
              <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </h2>
                  <div className="space-y-6">
                    {orderDetails.map((detail) => (
                      <div key={detail.id} className="flex items-center gap-6 p-4 rounded-lg bg-muted/40">
                        <div className="relative aspect-square h-24 w-24 min-w-fit overflow-hidden rounded-lg border bg-white">
                          <Image
                            src={detail.product.imageURL}
                            alt={detail.product.nom || `Product #${detail.produitID}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-lg truncate">
                            {detail.product.nom || `Product #${detail.produitID}`}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                            <p className="text-sm">Unit Price: {formatPrice(detail.prixUnitaire)}</p>
                            <span className="text-sm">•</span>
                            <p className="text-sm">Quantity: {detail.quantite}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">
                            {formatPrice(detail.prixUnitaire * detail.quantite)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="p-6 bg-muted/40">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="text-2xl font-bold">
                        {formatPrice(
                          orderDetails.reduce(
                            (total, detail) => total + detail.prixUnitaire * detail.quantite,
                            0
                          )
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Order Confirmed</span>
                    </div>
                  </div>
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