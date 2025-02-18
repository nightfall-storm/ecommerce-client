import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart,
} from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface NavigationItem {
  title: string
  url: string
  icon: LucideIcon
  items?: NavigationItem[]
}

export interface Navigation {
  navMain: NavigationItem[]
}

export const adminNavigation: Navigation = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "/admin/orders",
          icon: ShoppingCart,
        },
        {
          title: "Pending Orders",
          url: "/admin/orders/pending",
          icon: Package,
        },
        {
          title: "Completed Orders",
          url: "/admin/orders/completed",
          icon: Package,
        },
      ],
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: Package,
      items: [
        {
          title: "All Products",
          url: "/admin/products",
          icon: Package,
        },
        {
          title: "Add Product",
          url: "/admin/products/new",
          icon: Package,
        },
        {
          title: "Categories",
          url: "/admin/products/categories",
          icon: Package,
        },
      ],
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: Users,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
}
