"use client"

import { useQuery } from "@tanstack/react-query"
import { getOrders } from "@/services/orders"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Loader2 } from "lucide-react"

export function OrdersContainer() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  })

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={orders || []} />
    </div>
  )
}