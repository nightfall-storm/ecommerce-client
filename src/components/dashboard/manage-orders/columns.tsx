"use client"

import { ColumnDef, FilterFn } from "@tanstack/react-table"
import { Order, OrderStatus, updateOrderStatus } from "@/services/orders"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// Define a type-safe filter function
const numericFilter: FilterFn<Order> = (row, columnId, value) => {
  const rowValue = String(row.getValue(columnId)).replace('#', '')
  const searchValue = String(value).replace('#', '')
  return rowValue.includes(searchValue)
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
    filterFn: numericFilter,
  },
  {
    accessorKey: "clientID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client ID" />
    ),
    cell: ({ row }) => <div>#{row.getValue("clientID")}</div>,
  },
  {
    accessorKey: "dateCommande",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateCommande"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "statut",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("statut") as string
      return (
        <Badge
          variant="outline"
          className={
            status.toLowerCase() === "completed"
              ? "bg-green-100 text-green-800 border-green-200"
              : status.toLowerCase() === "processing"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : status.toLowerCase() === "pending"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : "bg-red-100 text-red-800 border-red-200"
          }
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      return <div className="font-medium">{formatPrice(amount)}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original
      const queryClient = useQueryClient()

      const handleStatusUpdate = async (newStatus: OrderStatus) => {
        try {
          await updateOrderStatus(order.id, newStatus)
          // Invalidate and refetch orders
          await queryClient.invalidateQueries({ queryKey: ["orders"] })
          toast.success(`Order status updated to ${newStatus}`)
        } catch (error) {
          toast.error("Failed to update order status")
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/orders/${order.id}`}>View order details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Clock className="mr-2 h-4 w-4" />
                Update status
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleStatusUpdate("Pending")}>
                  <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                  Mark as Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusUpdate("Processing")}>
                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                  Mark as Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusUpdate("Completed")}>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("Cancelled")}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Order
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]