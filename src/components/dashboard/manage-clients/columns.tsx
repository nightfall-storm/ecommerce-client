"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Client, deleteClient, updateClient } from "@/services/clients"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2, User, ShoppingBag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { getOrders, getOrderDetails, Order, OrderDetail } from "@/services/orders"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

interface OrderWithDetails extends Order {
  details?: OrderDetail[]
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client ID" />
    ),
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("nom")}</div>,
  },
  {
    accessorKey: "prenom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("prenom")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "telephone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div>{row.getValue("telephone")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original
      const queryClient = useQueryClient()
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
      const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false)
      const [orders, setOrders] = useState<OrderWithDetails[]>([])
      const [isLoadingOrders, setIsLoadingOrders] = useState(false)
      const [editForm, setEditForm] = useState({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        adresse: client.adresse,
        telephone: client.telephone,
      })

      const handleViewOrders = async () => {
        setIsOrdersDialogOpen(true)
        setIsLoadingOrders(true)
        try {
          const clientOrders = await getOrders(client.id)
          const ordersWithDetails = await Promise.all(
            clientOrders.map(async (order) => {
              const details = await getOrderDetails(order.id)
              return { ...order, details }
            })
          )
          setOrders(ordersWithDetails)
        } catch (error) {
          toast.error("Failed to fetch orders")
        } finally {
          setIsLoadingOrders(false)
        }
      }

      const handleDelete = async () => {
        try {
          await deleteClient(client.id)
          await queryClient.invalidateQueries({ queryKey: ["clients"] })
          toast.success("Client deleted successfully")
        } catch (error) {
          toast.error("Failed to delete client")
        }
      }

      const handleUpdate = async () => {
        try {
          await updateClient(client.id, editForm)
          await queryClient.invalidateQueries({ queryKey: ["clients"] })
          setIsEditDialogOpen(false)
          toast.success("Client updated successfully")
        } catch (error) {
          toast.error("Failed to update client")
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
            <DropdownMenuItem onSelect={(e) => {
              e.preventDefault()
              handleViewOrders()
            }}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Orders
            </DropdownMenuItem>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Client
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Client</DialogTitle>
                  <DialogDescription>
                    Make changes to client information here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nom" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      id="nom"
                      value={editForm.nom}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nom: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="prenom" className="text-right">
                      First Name
                    </Label>
                    <Input
                      id="prenom"
                      value={editForm.prenom}
                      onChange={(e) =>
                        setEditForm({ ...editForm, prenom: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="telephone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="telephone"
                      value={editForm.telephone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, telephone: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="adresse" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="adresse"
                      value={editForm.adresse}
                      onChange={(e) =>
                        setEditForm({ ...editForm, adresse: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Client
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    client #{client.id} and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Dialog open={isOrdersDialogOpen} onOpenChange={setIsOrdersDialogOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Orders for {client.prenom} {client.nom}</DialogTitle>
                  <DialogDescription>
                    View all orders and their details for this client.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {isLoadingOrders ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No orders found for this client.
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <Accordion type="single" collapsible className="w-full">
                        {orders.map((order) => (
                          <AccordionItem key={order.id} value={order.id.toString()}>
                            <AccordionTrigger className="px-4">
                              <div className="flex items-center gap-4">
                                <span>Order #{order.id}</span>
                                <Badge
                                  variant="outline"
                                  className={
                                    order.statut.toLowerCase() === "completed"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : order.statut.toLowerCase() === "processing"
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : order.statut.toLowerCase() === "pending"
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      : "bg-red-100 text-red-800 border-red-200"
                                  }
                                >
                                  {order.statut}
                                </Badge>
                                <span className="text-muted-foreground">
                                  {new Date(order.dateCommande).toLocaleDateString()}
                                </span>
                                <span className="font-medium">
                                  {formatPrice(order.total)}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4">
                              <div className="space-y-4">
                                {order.details?.map((detail) => (
                                  <div
                                    key={detail.id}
                                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/40"
                                  >
                                    <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded-lg border bg-white">
                                      <Image
                                        src={detail.product.imageURL}
                                        alt={detail.product.nom}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium truncate">
                                        {detail.product.nom}
                                      </h4>
                                      <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                                        <p className="text-sm">
                                          Unit Price: {formatPrice(detail.prixUnitaire)}
                                        </p>
                                        <span className="text-sm">•</span>
                                        <p className="text-sm">
                                          Quantity: {detail.quantite}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">
                                        {formatPrice(detail.prixUnitaire * detail.quantite)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </ScrollArea>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOrdersDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]