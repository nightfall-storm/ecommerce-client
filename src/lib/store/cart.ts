import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id)
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          }
        }
        return { items: [...state.items, item] }
      }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)