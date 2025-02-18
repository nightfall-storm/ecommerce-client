"use client"

import { useQuery } from "@tanstack/react-query"
import { getClients } from "@/services/clients"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Loader2 } from "lucide-react"

export function ClientsContainer() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
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
      <DataTable columns={columns} data={clients || []} />
    </div>
  )
}