import api from '@/lib/axios'

export interface Product {
  id: number
  nom: string
  description: string
  prix: number
  stock: number
  imageURL: string
  categorieID: number
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>('/products')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch products: ${error.message}`)
    }
    throw new Error('Failed to fetch products')
  }
}

export const getProduct = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch product: ${error.message}`)
    }
    throw new Error('Failed to fetch product')
  }
}
