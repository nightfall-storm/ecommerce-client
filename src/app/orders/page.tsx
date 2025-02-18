"use client"

import { useQuery } from "@tanstack/react-query"
import { getOrders, getOrderDetails } from "@/services/orders"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Package, Calendar } from "lucide-react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/actions/auth"
import { Loader } from "@/components/loader"

interface OrderWithDetails {
  id: number
  clientID: number
  dateCommande: string
  statut: string
  total: number
  details?: {
    id: number
    commandeID: number
    produitID: number
    quantite: number
    prixUnitaire: number
    product: {
      id: number
      nom: string
      description: string
      prix: number
      stock: number
      imageURL: string
      categorieID: number
    }
  }[]
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function OrdersPage() {
  // Query for user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: getUser
  })

  // Query for orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => getOrders(user?.id!),
    enabled: !!user?.id,
  })

  // Query for order details
  const { data: ordersWithDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['ordersDetails', orders],
    queryFn: async () => {
      if (!orders) return []
      const detailedOrders = await Promise.all(
        orders.map(async (order) => {
          const details = await getOrderDetails(order.id)
          return { ...order, details }
        })
      )
      return detailedOrders
    },
    enabled: !!orders,
  })

  const isLoading = isLoadingUser || isLoadingOrders || isLoadingDetails

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {isLoading ? (
            <div className="h-[400px]">
              <Loader size="lg" className="h-full" />
            </div>
          ) : !ordersWithDetails || ordersWithDetails.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't placed any orders yet.
              </p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {ordersWithDetails
                .sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime())
                .map((order: OrderWithDetails) => (
                <div
                  key={order.id}
                  className="border rounded-lg overflow-hidden bg-card"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="space-y-1">
                        <h2 className="text-lg font-medium">Order #{order.id}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.dateCommande).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={getStatusColor(order.statut)}
                      >
                        {order.statut}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      {order.details?.map((detail) => (
                        <div
                          key={detail.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted/40"
                        >
                          <div className="relative aspect-square h-20 w-20 min-w-fit overflow-hidden rounded-lg border bg-white">
                            <Image
                              src={detail.product.imageURL}
                              alt={detail.product.nom}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {detail.product.nom}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <p>Unit Price: {formatPrice(detail.prixUnitaire)}</p>
                              <span>•</span>
                              <p>Quantity: {detail.quantite}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPrice(detail.prixUnitaire * detail.quantite)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold">{formatPrice(order.total)}</p>
                      </div>
                      <Button asChild variant="outline">
                        <Link href={`/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}