import React from "react";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { DashboardBreadcrumb } from "@/components/shared/DashboardBreadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="dashboard-theme"
    >
      <div className="flex h-screen overflow-hidden">
        <SidebarProvider>
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex h-14 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DashboardBreadcrumb />
              <div className="flex-1" />
              {/* <Button onClick={logout}>Logout</Button> */}
            </header>
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </SidebarProvider>
      </div>
      {/* Portal container for floating elements */}
      <div id="floating-elements" />
    </ThemeProvider>
  );
}