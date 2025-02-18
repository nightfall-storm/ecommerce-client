import api from '@/lib/axios'
import { CartItem } from '@/lib/store/cart'

export interface OrderRequest {
  id: number
  clientID: number
  dateCommande: string
  statut: string
  total: number
}

export interface OrderDetailRequest {
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
}

export interface CheckoutResponse {
  orderId: number
  status: string
  total: number
}

export const createCheckoutSession = async (items: CartItem[]): Promise<CheckoutResponse> => {
  try {
    const clientId = 19
    const total = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    // First, create the order
    const orderRequest: OrderRequest = {
      id: 0, // The server will assign the actual ID
      clientID: clientId,
      dateCommande: new Date().toISOString(),
      statut: "Pending",
      total: total
    }

    const orderResponse = await api.post('/api/Orders', orderRequest)
    const orderId = orderResponse.data.id

    // Then, create order details one by one
    for (const item of items) {
      const orderDetail: OrderDetailRequest = {
        id: 0, // The server will assign the actual ID
        commandeID: orderId,
        produitID: item.id,
        quantite: item.quantity,
        prixUnitaire: item.price,
        product: {
          id: item.id,
          nom: item.name,
          description: "", // We don't have this in CartItem
          prix: item.price,
          stock: item.stock,
          imageURL: item.image,
          categorieID: 0 // We don't have this in CartItem
        }
      }
      await api.post('/OrderDetails', orderDetail)
    }

    // Update product stock using JSON Patch format
    const stockUpdatePromises = items.map(item =>
      api.patch(`/Products/${item.id}`, [
        {
          op: "replace",
          path: "/stock",
          value: item.stock - item.quantity
        }
      ], {
        headers: {
          'Content-Type': 'application/json-patch+json'
        }
      })
    )

    await Promise.all(stockUpdatePromises)

    return {
      orderId,
      status: 'success',
      total
    }
  } catch (error) {
    console.error('Checkout Error:', error)
    throw new Error('Failed to process checkout')
  }
}