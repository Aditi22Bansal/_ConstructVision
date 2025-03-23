"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Printer, BarChart3, FileText, Edit } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data for inventory
const inventoryData = {
  materials: [
    {
      id: "1",
      name: "Cement",
      stock: 15,
      unit: "tons",
      threshold: 20,
      status: "low",
      lastDelivery: "3 days ago",
      nextDelivery: "Tomorrow",
      trend: "down",
      supplier: "BuildCo Supplies",
      location: "Warehouse A",
      price: 120,
      category: "Building Materials",
    },
    {
      id: "2",
      name: "Steel Rebar",
      stock: 65,
      unit: "tons",
      threshold: 30,
      status: "normal",
      lastDelivery: "1 week ago",
      nextDelivery: "In 2 weeks",
      trend: "stable",
      supplier: "SteelWorks Inc.",
      location: "Warehouse B",
      price: 850,
      category: "Structural Materials",
    },
    {
      id: "3",
      name: "Bricks",
      stock: 8500,
      unit: "pcs",
      threshold: 5000,
      status: "normal",
      lastDelivery: "5 days ago",
      nextDelivery: "In 1 week",
      trend: "up",
      supplier: "BrickMasters",
      location: "Warehouse A",
      price: 0.75,
      category: "Building Materials",
    },
    {
      id: "4",
      name: "Concrete Mix",
      stock: 42,
      unit: "bags",
      threshold: 50,
      status: "low",
      lastDelivery: "2 weeks ago",
      nextDelivery: "In 3 days",
      trend: "down",
      supplier: "MixMasters Inc.",
      location: "Warehouse C",
      price: 15,
      category: "Building Materials",
    },
    {
      id: "5",
      name: "Timber",
      stock: 78,
      unit: "pieces",
      threshold: 40,
      status: "normal",
      lastDelivery: "4 days ago",
      nextDelivery: "In 10 days",
      trend: "stable",
      supplier: "ForestProducts Co.",
      location: "Warehouse D",
      price: 35,
      category: "Structural Materials",
    },
    {
      id: "6",
      name: "Glass Panels",
      stock: 24,
      unit: "panels",
      threshold: 15,
      status: "normal",
      lastDelivery: "2 weeks ago",
      nextDelivery: "In 3 weeks",
      trend: "up",
      supplier: "GlassTech Industries",
      location: "Warehouse B",
      price: 120,
      category: "Finishing Materials",
    },
  ],
  pendingDeliveries: [
    { id: 1, material: "Cement", quantity: 30, unit: "tons", supplier: "BuildCo Supplies", eta: "Tomorrow, 9:00 AM" },
    { id: 2, material: "Concrete Mix", quantity: 100, unit: "bags", supplier: "MixMasters Inc.", eta: "In 3 days" },
  ],
}

export default function InventoryReport() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const totalMaterials = inventoryData.materials.length
  const lowStockItems = inventoryData.materials.filter((material) => material.status === "low").length
  const totalValue = inventoryData.materials.reduce((sum, material) => sum + material.stock * material.price, 0)

  const materialsByCategory = inventoryData.materials.reduce(
    (acc, material) => {
      acc[material.category] = (acc[material.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const materialsByLocation = inventoryData.materials.reduce(
    (acc, material) => {
      acc[material.location] = (acc[material.location] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/inventory")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <h1 className="text-2xl font-bold">Inventory Report</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/inventory/edit")}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Inventory
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMaterials}</div>
            <p className="text-xs text-muted-foreground">Types in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Materials below threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inventoryData.pendingDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">Expected within 3 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Report</TabsTrigger>
            <TabsTrigger value="deliveries">Pending Deliveries</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Full Report
            </Button>
          </div>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Materials by Category</CardTitle>
                <CardDescription>Distribution of materials by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(materialsByCategory).map(([category, count]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm text-muted-foreground">{count} items</span>
                      </div>
                      <Progress value={(count / totalMaterials) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Materials by Location</CardTitle>
                <CardDescription>Distribution of materials by storage location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(materialsByLocation).map(([location, count]) => (
                    <div key={location}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{location}</span>
                        <span className="text-sm text-muted-foreground">{count} items</span>
                      </div>
                      <Progress value={(count / totalMaterials) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Inventory Report</CardTitle>
              <CardDescription>Complete list of all materials in inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>{material.category}</TableCell>
                      <TableCell>
                        {material.stock} {material.unit}
                      </TableCell>
                      <TableCell>{material.threshold}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            material.status === "low"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-green-500/10 text-green-500 border-green-500/20"
                          }
                        >
                          {material.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{material.location}</TableCell>
                      <TableCell>{material.supplier}</TableCell>
                      <TableCell className="text-right">
                        ${(material.stock * material.price).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Pending Deliveries</CardTitle>
              <CardDescription>Upcoming material shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>ETA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.pendingDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.material}</TableCell>
                      <TableCell>
                        {delivery.quantity} {delivery.unit}
                      </TableCell>
                      <TableCell>{delivery.supplier}</TableCell>
                      <TableCell>{delivery.eta}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

