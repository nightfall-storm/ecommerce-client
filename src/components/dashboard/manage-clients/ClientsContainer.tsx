"use client"

import { useQuery } from "@tanstack/react-query"
import { getClients } from "@/services/clients"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Loader } from "@/components/loader"

export function ClientsContainer() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
      </div>
      <DataTable columns={columns} data={clients || []} />
    </div>
  )
}