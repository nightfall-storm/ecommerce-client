import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface NavigationItem {
  title: string
  url: string
  icon: LucideIcon
}

export interface Navigation {
  navMain: NavigationItem[]
}

export const adminNavigation: Navigation = {
  navMain: [
    {
      title: "Manage Orders",
      url: "/admin/manage-orders",
      icon: ShoppingCart,
    },
    {
      title: "Manage Products",
      url: "/admin/manage-products",
      icon: Package,
    },
    {
      title: "Manage Clients",
      url: "/admin/manage-clients",
      icon: Users,
    },
  ],
}
