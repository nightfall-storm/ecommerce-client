"use client"

import { useQuery } from "@tanstack/react-query"
import { getOrders } from "@/services/orders"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Loader } from "@/components/loader"

export function OrdersContainer() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  })

  if (isLoading) {
    return (
      <div className="h-[400px]">
        <Loader size="lg" className="h-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={orders || []} />
    </div>
  )
}