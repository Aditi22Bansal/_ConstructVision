"use client"

import type React from "react"

import { useState } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Building2, HardHat, BarChart3, Package, AlertTriangle, Settings, User } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeSite, setActiveSite] = useState("Site Alpha")

  const menuItems = [
    { icon: Building2, label: "Digital Twin", href: "/" },
    { icon: HardHat, label: "Safety Monitoring", href: "/safety" },
    { icon: Package, label: "Inventory", href: "/inventory" },
    // { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: AlertTriangle, label: "Alerts", href: "/alerts" },
    // { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center p-4">
              <div className="font-bold text-xl">ConstructVision</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Site: {activeSite}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild tooltip={item.label}>
                        <a href={item.href} className="flex items-center">
                          <item.icon className="mr-2" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <User className="mr-2" />
                  <span>Codeini</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <header className="bg-background border-b p-4 flex items-center">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold">Construction Site Monitoring</h1>
          </header>
          <main className="p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

