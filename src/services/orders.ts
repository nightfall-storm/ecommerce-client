import api from '@/lib/axios'

export interface Order {
  id: number
  clientID: number
  dateCommande: string
  statut: string
  total: number
}

type CreateOrder = Omit<Order, "id">

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

export const createOrder = async (orderData: CreateOrder): Promise<Order> => {
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
    // Updated endpoint to use the correct client orders endpoint
    const endpoint = clientId ? `/api/Orders/Client/${clientId}` : '/api/Orders'
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
    // Updated to use the correct order details endpoint
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

export const deleteOrder = async (orderId: number): Promise<void> => {
  try {
    await api.delete(`/api/Orders/${orderId}`)
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to delete order')
  }
}

// Add new functions for order details management
export const createOrderDetail = async (orderDetail: Omit<OrderDetail, 'id'>): Promise<OrderDetail> => {
  try {
    const response = await api.post<OrderDetail>('/OrderDetails', orderDetail)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to create order detail')
  }
}

export const updateOrderDetail = async (id: number, data: Partial<OrderDetail>): Promise<OrderDetail> => {
  try {
    const response = await api.patch<OrderDetail>(`/OrderDetails/${id}`, data)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to update order detail')
  }
}

export const deleteOrderDetail = async (id: number): Promise<void> => {
  try {
    await api.delete(`/OrderDetails/${id}`)
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to delete order detail')
  }
}

export const getAllOrderDetails = async (): Promise<OrderDetail[]> => {
  try {
    const response = await api.get<OrderDetail[]>('/OrderDetails')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to fetch all order details')
  }
}

export const getOrderDetailById = async (id: number): Promise<OrderDetail> => {
  try {
    const response = await api.get<OrderDetail>(`/OrderDetails/${id}`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to fetch order detail')
  }
}