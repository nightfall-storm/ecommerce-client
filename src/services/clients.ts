import api from '@/lib/axios'

export interface Client {
  id: number
  nom: string
  prenom: string
  email: string
  motDePasse?: string // Optional since we don't always need it
  adresse: string
  telephone: string
}

export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await api.get<Client[]>('/api/Clients')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to fetch clients')
  }
}

export const getClient = async (id: number): Promise<Client> => {
  try {
    const response = await api.get<Client>(`/api/Clients/${id}`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to fetch client')
  }
}

export const updateClient = async (id: number, data: Partial<Client>): Promise<Client> => {
  try {
    const response = await api.patch<Client>(`/api/Clients/${id}`, data)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to update client')
  }
}

export const deleteClient = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/Clients/${id}`)
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Failed to delete client')
  }
}