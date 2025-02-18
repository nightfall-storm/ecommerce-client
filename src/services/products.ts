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

export interface ProductsResponse {
  items: Product[]
  hasMore: boolean
  total: number
}

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getProducts = async (page: number = 1, limit: number = 8): Promise<ProductsResponse> => {
  try {
    // Add artificial delay
    await delay(2000)

    const response = await api.get<Product[]>('/products')
    const products = response.data
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = products.slice(startIndex, endIndex)

    return {
      items: paginatedProducts,
      hasMore: endIndex < products.length,
      total: products.length
    }
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
