import api from '@/lib/axios'

export interface Order {
  id: number
  clientID: number
  dateCommande: string
  statut: string
  total: number
}

export interface OrderDetail {
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

export interface CreateOrderRequest {
  clientID: number
  items: {
    produitID: number
    quantite: number
    prixUnitaire: number
  }[]
}

export type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled"

export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  try {
    const response = await api.post<Order>('/api/Orders', orderData)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to create order')
  }
}

export const getOrders = async (clientId?: number): Promise<Order[]> => {
  try {
    // If clientId is provided, get orders for that client
    // Otherwise get all orders (admin view)
    const endpoint = clientId ? `/api/Clients/${clientId}/orders` : '/api/Orders'
    const response = await api.get<Order[]>(endpoint)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to fetch orders')
  }
}

export const getOrder = async (orderId: number): Promise<Order> => {
  try {
    const response = await api.get<Order>(`/api/Orders/${orderId}`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to fetch order')
  }
}

export const getOrderDetails = async (orderId: number): Promise<OrderDetail[]> => {
  try {
    const response = await api.get<OrderDetail[]>(`/OrderDetails/Order/${orderId}`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to fetch order details')
  }
}

export const updateOrderStatus = async (orderId: number, status: OrderStatus): Promise<Order> => {
  try {
    const response = await api.patch<Order>(`/api/Orders/${orderId}/status`, {
      status: status
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to update order status')
  }
}