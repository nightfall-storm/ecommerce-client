"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCartStore } from "@/lib/store/cart"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { getUser } from "@/lib/actions/auth"
import { Loader } from "@/components/loader"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { createCheckoutSession } from "@/services/checkout"

interface ShippingDetails {
  fullName: string
  address: string
  phone: string
  email: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: "",
    address: "",
    phone: "",
    email: "",
  })

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: getUser
  })

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  // Update shipping details from user data when available
  useEffect(() => {
    if (user) {
      setShippingDetails({
        fullName: `${user.prenom} ${user.nom}`,
        address: user.adresse || "",
        phone: user.telephone || "",
        email: user.email,
      })
    }
  }, [user])

  // Redirect to home if cart is empty
  // useEffect(() => {
  //   if (items.length === 0) {
  //     router.push("/")
  //   }
  // }, [items, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please log in to complete your purchase")
      router.push("/login")
      return
    }

    if (items.length === 0) {
      toast.error("Your cart is empty")
      router.push("/")
      return
    }

    // Validate shipping details
    if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone || !shippingDetails.email) {
      toast.error("Please fill in all shipping details")
      return
    }

    try {
      setLoading(true)

      // Process the checkout using createCheckoutSession
      const result = await createCheckoutSession(items)

      if (result.status === 'success') {
        clearCart()
        toast.success("Order placed successfully!")
        // router.push("/orders")
      } else {
        throw new Error('Checkout failed')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart to proceed with checkout
            </p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isLoadingUser) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={shippingDetails.fullName}
                        onChange={(e) =>
                          setShippingDetails((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Shipping Address</Label>
                      <Input
                        id="address"
                        value={shippingDetails.address}
                        onChange={(e) =>
                          setShippingDetails((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingDetails.phone}
                        onChange={(e) =>
                          setShippingDetails((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingDetails.email}
                        onChange={(e) =>
                          setShippingDetails((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Input type="radio" checked readOnly className="w-4 h-4" />
                    <Label>Cash on Delivery</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Items */}
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex space-x-4">
                          <div className="relative w-16 h-16">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover rounded"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>Free</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}