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
import { motion } from "framer-motion"

interface Order {
  id: number
  dateCommande: string
  statut: string
  total: number
  numberOfItems: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUser
  })

  if (isLoading) {
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
            className="h-[400px]"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Loader size="lg" className="h-full" />
          </motion.div>
        </main>
        <Footer />
      </motion.div>
    )
  }

  if (!user) {
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
            className="text-center"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-4">
              Please log in to view your profile.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </motion.div>
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
        <motion.div
          className="max-w-5xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Overview */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Overview</CardTitle>
                    <CardDescription>Your personal information</CardDescription>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" asChild>
                      <Link href="/profile/edit">Edit Profile</Link>
                    </Button>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{`${user.prenom} ${user.nom}`}</p>
                    <p className="text-sm text-muted-foreground">
                      Member since {new Date(user.createdAt).getFullYear()}
                    </p>
                  </div>
                </motion.div>

                <Separator />

                <motion.div
                  className="grid gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
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
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Statistics */}
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {[
              { title: "Total Orders", value: user.totalOrders || 0, icon: Package },
              { title: "Total Spent", value: formatPrice(user.totalSpent || 0), icon: Receipt },
              { title: "Products Bought", value: user.totalProductsBought || 0, icon: CreditCard },
              {
                title: "Last Order",
                value: user.lastOrderDate
                  ? new Date(user.lastOrderDate).toLocaleDateString()
                  : "No orders yet",
                icon: Clock
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Orders */}
          {user.recentOrders && user.recentOrders.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Your latest purchases</CardDescription>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" asChild>
                        <Link href="/orders">View All Orders</Link>
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                  >
                    {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                    {user.recentOrders.map((order: Order, index: number) => (
                      <motion.div
                        key={order.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
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
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </motion.div>
  )
}