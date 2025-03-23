"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Truck,
  Calendar,
  ArrowRight,
  Search,
  Edit,
  FileText,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

// Mock data for inventory
const inventoryData = {
  materials: [
    {
      id: 1,
      name: "Cement",
      stock: 15,
      unit: "tons",
      threshold: 20,
      status: "low",
      lastDelivery: "3 days ago",
      nextDelivery: "Tomorrow",
      trend: "down",
    },
    {
      id: 2,
      name: "Steel Rebar",
      stock: 65,
      unit: "tons",
      threshold: 30,
      status: "normal",
      lastDelivery: "1 week ago",
      nextDelivery: "In 2 weeks",
      trend: "stable",
    },
    {
      id: 3,
      name: "Bricks",
      stock: 8500,
      unit: "pcs",
      threshold: 5000,
      status: "normal",
      lastDelivery: "5 days ago",
      nextDelivery: "In 1 week",
      trend: "up",
    },
    {
      id: 4,
      name: "Concrete Mix",
      stock: 42,
      unit: "bags",
      threshold: 50,
      status: "low",
      lastDelivery: "2 weeks ago",
      nextDelivery: "In 3 days",
      trend: "down",
    },
    {
      id: 5,
      name: "Timber",
      stock: 78,
      unit: "pieces",
      threshold: 40,
      status: "normal",
      lastDelivery: "4 days ago",
      nextDelivery: "In 10 days",
      trend: "stable",
    },
    {
      id: 6,
      name: "Glass Panels",
      stock: 24,
      unit: "panels",
      threshold: 15,
      status: "normal",
      lastDelivery: "2 weeks ago",
      nextDelivery: "In 3 weeks",
      trend: "up",
    },
  ],
  pendingDeliveries: [
    { id: 1, material: "Cement", quantity: 30, unit: "tons", supplier: "BuildCo Supplies", eta: "Tomorrow, 9:00 AM" },
    { id: 2, material: "Concrete Mix", quantity: 100, unit: "bags", supplier: "MixMasters Inc.", eta: "In 3 days" },
  ],
  recentActivity: [
    { id: 1, action: "Used 2 tons of Cement", time: "3 hours ago", zone: "Zone A" },
    { id: 2, action: "Delivered 50 pieces of Timber", time: "4 days ago", zone: "Storage" },
    { id: 3, action: "Used 500 Bricks", time: "2 days ago", zone: "Zone C" },
  ],
}

// Material card component
function MaterialCard({ material, onEdit }) {
  const statusColors = {
    low: "bg-red-500/10 text-red-500 border-red-500/20",
    normal: "bg-green-500/10 text-green-500 border-green-500/20",
    excess: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  }

  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-green-500" />,
    down: <TrendingDown className="h-4 w-4 text-red-500" />,
    stable: null,
  }

  const stockPercentage = (material.stock / material.threshold) * 100
  const cappedPercentage = Math.min(stockPercentage, 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-base">{material.name}</CardTitle>
          <Badge className={statusColors[material.status]}>{material.status}</Badge>
        </div>
        <CardDescription>{material.lastDelivery}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="text-2xl font-bold">
            {material.stock} <span className="text-sm font-normal text-muted-foreground">{material.unit}</span>
          </div>
          <div className="flex items-center">{trendIcons[material.trend]}</div>
        </div>
        <Progress value={cappedPercentage} className="h-2" />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            Threshold: {material.threshold} {material.unit}
          </span>
          <span className="text-xs text-muted-foreground">{Math.round(stockPercentage)}%</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="text-xs text-muted-foreground">Next delivery: {material.nextDelivery}</div>
        <Button variant="ghost" size="sm" onClick={() => onEdit(material)}>
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// Pending delivery component
function PendingDelivery({ delivery }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md mb-2">
      <div>
        <div className="font-medium">{delivery.material}</div>
        <div className="text-sm text-muted-foreground">
          {delivery.quantity} {delivery.unit} from {delivery.supplier}
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-sm font-medium mr-2">{delivery.eta}</div>
        <Truck className="h-4 w-4 text-blue-500" />
      </div>
    </div>
  )
}

// Activity item component
function ActivityItem({ activity }) {
  return (
    <div className="flex items-start space-x-3 py-2 border-b last:border-0">
      <div className="bg-primary/10 p-1.5 rounded-full flex-shrink-0">
        <Package className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm">{activity.action}</p>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">{activity.time}</span>
          <span className="text-xs font-medium">{activity.zone}</span>
        </div>
      </div>
    </div>
  )
}

export default function InventoryDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredMaterials = inventoryData.materials.filter((material) =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEditMaterial = (material) => {
    router.push(`/inventory/edit/${material.id}`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track construction materials and supplies</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Order History
          </Button>
          <Button size="sm">
            <Truck className="h-4 w-4 mr-2" />
            Place Order
          </Button>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search materials..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex ml-4">
          <Button variant="outline" size="sm" className="mr-2" onClick={() => router.push("/inventory/report")}>
            <FileText className="h-4 w-4 mr-2" />
            View Report
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push("/inventory/edit")}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Inventory
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">2</div>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground">Materials below threshold</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{inventoryData.pendingDeliveries.length}</div>
              <Truck className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground">Expected within 3 days</p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{inventoryData.materials.length}</div>
              <Package className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">Types in inventory</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Materials</TabsTrigger>
                <TabsTrigger value="low">Low Stock</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMaterials.map((material) => (
                  <MaterialCard key={material.id} material={material} onEdit={handleEditMaterial} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="low">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMaterials
                  .filter((material) => material.status === "low")
                  .map((material) => (
                    <MaterialCard key={material.id} material={material} onEdit={handleEditMaterial} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Deliveries</CardTitle>
              <CardDescription>Upcoming material shipments</CardDescription>
            </CardHeader>
            <CardContent>
              {inventoryData.pendingDeliveries.length > 0 ? (
                inventoryData.pendingDeliveries.map((delivery) => (
                  <PendingDelivery key={delivery.id} delivery={delivery} />
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No pending deliveries</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest inventory changes</CardDescription>
            </CardHeader>
            <CardContent>
              {inventoryData.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

