"use client"

import { useCartStore } from "@/lib/store/cart"
import type { CartItem } from "@/lib/store/cart"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function Cart() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCartStore()

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        toast.error('Please login to checkout')
        setIsOpen(false)
        router.push('/login')
        return
      }

      router.push('/checkout')
      setIsOpen(false)
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Cart ({getTotalItems()} items)</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 pr-6">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={() => removeItem(item.id)}
                  onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                />
              ))}
            </div>
          </ScrollArea>
          {items.length > 0 ? (
            <div className="space-y-4 pr-6">
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-2">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
              <span className="text-lg font-medium text-muted-foreground">Your cart is empty</span>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 64px) 100vw, 64px"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 text-sm">
        <span className="line-clamp-1">{item.name}</span>
        <span className="text-muted-foreground">${item.price}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-4 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={onRemove}>
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}