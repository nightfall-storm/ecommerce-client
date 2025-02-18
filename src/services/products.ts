import api from '@/lib/axios'

export interface Product {
  id: number
  nom: string
  description: string
  prix: number
  stock: number
  imageURL: string
  categorieID: number
  orderDetails?: OrderDetail[]
}

export interface OrderDetail {
  id: number
  commandeID: number
  produitID: number
  quantite: number
  prixUnitaire: number
  order: {
    id: number
    clientID: number
    dateCommande: string
    statut: string
    total: number
  }
  product: string
}

export interface ProductsPageResponse {
  items: Product[]
  hasMore: boolean
  total: number
  currentPage: number
  pageSize: number
}

// For dashboard - get all products without pagination
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>('/Products')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to fetch products')
  }
}

// For public page - get products with pagination
export const getPublicProducts = async (page: number = 1, pageSize: number = 8): Promise<ProductsPageResponse> => {
  try {
    const response = await api.get<Product[]>('/Products')
    const products = response.data

    // Calculate pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedProducts = products.slice(startIndex, endIndex)

    return {
      items: paginatedProducts,
      hasMore: endIndex < products.length,
      total: products.length,
      currentPage: page,
      pageSize: pageSize
    }
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to fetch products')
  }
}

export const getProduct = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/Products/${id}`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to fetch product')
  }
}

export const createProduct = async (productData: FormData): Promise<Product> => {
  try {
    const response = await api.post<Product>('/Products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to create product')
  }
}

export const updateProduct = async (id: number, productData: FormData): Promise<Product> => {
  try {
    const response = await api.patch<Product>(`/Products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to update product')
  }
}

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/Products/${id}`)
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to delete product')
  }
}
