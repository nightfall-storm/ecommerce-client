"use client";

import { Briefcase, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { adminNavigation } from "@/core/constants/sidebar-navigation.const";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";

interface DashboardSidebarProps {
  userRole?: "admin";
}

interface NavigationItemWithActive {
  title: string;
  url: string;
  icon: any;
  isActive: boolean;
}

// Base styles that won't change between server and client
const activeItemClass = "text-primaryHex-600 dark:text-primaryHex-400 font-medium";

// Get navigation items based on user role
const getNavigationItems = (pathname: string): NavigationItemWithActive[] => {
  return adminNavigation.navMain.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }));
};

export function DashboardSidebar({
  userRole = "admin",
  ...props
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();

  const navigationItems = getNavigationItems(pathname);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Admin Dashboard">
              <Link href="/admin/manage-orders">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Briefcase className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">E-Shop</span>
                  <span className="text-xs text-muted-foreground">
                    Admin Portal
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="w-full transition-colors"
                  asChild
                >
                  <Link
                    href={item.url}
                    className={cn(
                      "group/main flex w-full items-center hover:bg-accent/50",
                      item.isActive ? activeItemClass : ""
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "mr-2 size-4 transition-colors group-hover/main:stroke-primaryHex-600 dark:group-hover/main:stroke-primaryHex-400",
                          item.isActive &&
                            "[&>*]:stroke-primaryHex-600 dark:[&>*]:stroke-primaryHex-400"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "flex-1 group-hover/main:text-primaryHex-600 dark:group-hover/main:text-primaryHex-400",
                        item.isActive ? activeItemClass : ""
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto">
        <Separator className="my-2" />
        <SidebarFooter className="py-2">
          <div
            className={cn(
              state !== "collapsed" &&
                "flex flex-row items-center justify-between gap-2 px-2"
            )}
          >
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className={cn(state !== "collapsed" ? "w-9" : "w-9 mt-2")}
            >
              <Link href="/login">
                <LogOut />
              </Link>
            </Button>
          </div>
        </SidebarFooter>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}