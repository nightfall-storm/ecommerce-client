"use client"

import { useQuery } from "@tanstack/react-query"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getUser } from "@/lib/actions/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CreditCard,
  Package,
  Receipt,
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Loader } from "@/components/loader"

interface Order {
  id: number
  dateCommande: string
  statut: string
  total: number
  numberOfItems: number
}

interface UserProfile {
  id: number
  nom: string
  prenom: string
  email: string
  adresse: string
  telephone: string
  role: string
  totalOrders: number
  totalSpent: number
  totalProductsBought: number
  ordersByStatus: {
    [key: string]: number
  }
  lastOrderDate: string
  recentOrders: Order[]
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

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUser
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="h-[400px]">
            <Loader size="lg" className="h-full" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-4">
              Please log in to view your profile.
            </p>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
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
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Overview</CardTitle>
                  <CardDescription>Your personal information</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/profile/edit">Edit Profile</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{`${user.prenom} ${user.nom}`}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(user.createdAt).getFullYear()}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                {user.adresse && (
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.adresse}</span>
                  </div>
                )}
                {user.telephone && (
                  <div className="flex items-center space-x-4">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.telephone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.totalOrders || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Spent
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(user.totalSpent || 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Products Bought
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.totalProductsBought || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Last Order
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.lastOrderDate
                    ? new Date(user.lastOrderDate).toLocaleDateString()
                    : "No orders yet"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          {user.recentOrders && user.recentOrders.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest purchases</CardDescription>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/orders">View All Orders</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.recentOrders.map((order: Order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">Order #{order.id}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(order.dateCommande).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(order.total)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.numberOfItems} items
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(order.statut)}
                        >
                          {order.statut}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}