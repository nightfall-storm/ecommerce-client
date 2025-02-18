"use client"

import { useState } from "react"
import { Product, createProduct, deleteProduct, getProducts, updateProduct } from "@/services/products"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { ProductDialog } from "./product-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export default function ProductsContainer() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query for fetching products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  // Mutation for creating a product
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setDialogOpen(false)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Mutation for updating a product
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateProduct(id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product updated successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setDialogOpen(false)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Mutation for deleting a product
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleCreateProduct = async (formData: FormData) => {
    createMutation.mutate(formData)
  }

  const handleUpdateProduct = async (formData: FormData) => {
    if (!selectedProduct) return
    updateMutation.mutate({ id: selectedProduct.id, data: formData })
  }

  const handleDeleteProduct = async (productId: number) => {
    deleteMutation.mutate(productId)
  }

  const handleOpenDialog = (product?: Product) => {
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const productColumns = columns({
    onEdit: handleOpenDialog,
    onDelete: handleDeleteProduct,
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      <DataTable columns={productColumns} data={products || []} />
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
      />
    </div>
  )
}