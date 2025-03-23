"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Building2, HardHat, Package, AlertTriangle, User } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeSite, setActiveSite] = useState("Site Alpha")

  const [weather, setWeather] = useState<{ temp: number; description: string } | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        const city = "Pune" // Change this to your preferred city
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        const data = await response.json()

        if (data.main && data.weather) {
          setWeather({
            temp: data.main.temp,
            description: data.weather[0].description,
          })
        }
      } catch (error) {
        console.error("Error fetching weather data:", error)
      }
    }

    fetchWeather()
  }, [])

  const menuItems = [
    { icon: Building2, label: "Digital Twin", href: "/" },
    { icon: HardHat, label: "Safety Monitoring", href: "/safety" },
    { icon: Package, label: "Inventory", href: "/inventory" },
    { icon: AlertTriangle, label: "Alerts", href: "/alerts" },
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
            {/* Weather Section */}
            {weather && (
              <div className="p-4 text-sm text-gray-500">
                🌡 {weather.temp}°C - {weather.description}
              </div>
            )}
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