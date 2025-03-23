"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
    { id: "1", material: "Cement", quantity: 30, unit: "tons", supplier: "BuildCo Supplies", eta: "Tomorrow, 9:00 AM" },
    { id: "2", material: "Concrete Mix", quantity: 100, unit: "bags", supplier: "MixMasters Inc.", eta: "In 3 days" },
  ],
  suppliers: [
    "BuildCo Supplies",
    "SteelWorks Inc.",
    "BrickMasters",
    "MixMasters Inc.",
    "ForestProducts Co.",
    "GlassTech Industries",
  ],
  locations: ["Warehouse A", "Warehouse B", "Warehouse C", "Warehouse D"],
  categories: [
    "Building Materials",
    "Structural Materials",
    "Finishing Materials",
    "Tools & Equipment",
    "Safety Equipment",
  ],
  units: ["tons", "pcs", "bags", "pieces", "panels", "liters", "kg", "m²", "m³"],
}

export default function InventoryEditForm({ materialId }: { materialId?: string }) {
  const router = useRouter()
  const isEditMode = !!materialId
  const [activeTab, setActiveTab] = useState(materialId ? "edit" : "all")
  const [materials, setMaterials] = useState(inventoryData.materials)
  const [pendingDeliveries, setPendingDeliveries] = useState(inventoryData.pendingDeliveries)
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    stock: 0,
    unit: "pcs",
    threshold: 0,
    supplier: "",
    location: "",
    price: 0,
    category: "",
  })
  const [deliveryFormOpen, setDeliveryFormOpen] = useState(false)
  const [deliveryForm, setDeliveryForm] = useState({
    id: "",
    material: "",
    quantity: 0,
    unit: "pcs",
    supplier: "",
    eta: "",
  })
  const [editingDelivery, setEditingDelivery] = useState<string | null>(null)

  useEffect(() => {
    if (materialId) {
      const material = inventoryData.materials.find((m) => m.id === materialId)
      if (material) {
        setSelectedMaterial(material)
        setFormData({
          name: material.name,
          stock: material.stock,
          unit: material.unit,
          threshold: material.threshold,
          supplier: material.supplier,
          location: material.location,
          price: material.price,
          category: material.category,
        })
      }
    }
  }, [materialId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "stock" || name === "threshold" || name === "price" ? Number.parseFloat(value) || 0 : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDeliveryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDeliveryForm({
      ...deliveryForm,
      [name]: name === "quantity" ? Number.parseFloat(value) || 0 : value,
    })
  }

  const handleDeliverySelectChange = (name: string, value: string) => {
    setDeliveryForm({
      ...deliveryForm,
      [name]: value,
    })
  }

  const handleSave = () => {
    if (isEditMode && selectedMaterial) {
      // Update existing material
      const updatedMaterials = materials.map((material) => {
        if (material.id === materialId) {
          return {
            ...material,
            ...formData,
            status: formData.stock < formData.threshold ? "low" : "normal",
          }
        }
        return material
      })
      setMaterials(updatedMaterials)
      alert("Material updated successfully!")
      router.push("/inventory")
    } else {
      // Add new material
      const newMaterial = {
        id: (materials.length + 1).toString(),
        ...formData,
        status: formData.stock < formData.threshold ? "low" : "normal",
        lastDelivery: "New",
        nextDelivery: "Not scheduled",
        trend: "stable",
      }
      setMaterials([...materials, newMaterial])
      alert("Material added successfully!")
      setFormData({
        name: "",
        stock: 0,
        unit: "pcs",
        threshold: 0,
        supplier: "",
        location: "",
        price: 0,
        category: "",
      })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      const updatedMaterials = materials.filter((material) => material.id !== id)
      setMaterials(updatedMaterials)
      if (isEditMode) {
        router.push("/inventory/edit")
      }
    }
  }

  const handleSelectMaterial = (material: any) => {
    setSelectedMaterial(material)
    setFormData({
      name: material.name,
      stock: material.stock,
      unit: material.unit,
      threshold: material.threshold,
      supplier: material.supplier,
      location: material.location,
      price: material.price,
      category: material.category,
    })
    setActiveTab("edit")
  }

  const handleAddNew = () => {
    setSelectedMaterial(null)
    setFormData({
      name: "",
      stock: 0,
      unit: "pcs",
      threshold: 0,
      supplier: "",
      location: "",
      price: 0,
      category: "",
    })
    setActiveTab("add")
  }

  const handleAddDelivery = () => {
    setDeliveryForm({
      id: "",
      material: selectedMaterial ? selectedMaterial.name : "",
      quantity: 0,
      unit: selectedMaterial ? selectedMaterial.unit : "pcs",
      supplier: selectedMaterial ? selectedMaterial.supplier : "",
      eta: "",
    })
    setEditingDelivery(null)
    setDeliveryFormOpen(true)
  }

  const handleEditDelivery = (delivery: any) => {
    setDeliveryForm({
      id: delivery.id,
      material: delivery.material,
      quantity: delivery.quantity,
      unit: delivery.unit,
      supplier: delivery.supplier,
      eta: delivery.eta,
    })
    setEditingDelivery(delivery.id)
    setDeliveryFormOpen(true)
  }

  const handleDeleteDelivery = (id: string) => {
    if (confirm("Are you sure you want to delete this pending delivery?")) {
      const updatedDeliveries = pendingDeliveries.filter((delivery) => delivery.id !== id)
      setPendingDeliveries(updatedDeliveries)
    }
  }

  const handleSaveDelivery = () => {
    if (editingDelivery) {
      // Update existing delivery
      const updatedDeliveries = pendingDeliveries.map((delivery) => {
        if (delivery.id === editingDelivery) {
          return { ...deliveryForm, id: editingDelivery }
        }
        return delivery
      })
      setPendingDeliveries(updatedDeliveries)
    } else {
      // Add new delivery
      const newDelivery = {
        ...deliveryForm,
        id: (pendingDeliveries.length + 1).toString(),
      }
      setPendingDeliveries([...pendingDeliveries, newDelivery])
    }
    setDeliveryFormOpen(false)
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/inventory")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
        <h1 className="text-2xl font-bold">{isEditMode ? "Edit Material" : "Inventory Management"}</h1>
      </div>

      {!isEditMode && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Materials</TabsTrigger>
              <TabsTrigger value="edit">Edit Material</TabsTrigger>
              <TabsTrigger value="add">Add New</TabsTrigger>
              <TabsTrigger value="deliveries">Pending Deliveries</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Material
            </Button>
          </div>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((material) => (
                <Card
                  key={material.id}
                  className="cursor-pointer hover:border-primary"
                  onClick={() => handleSelectMaterial(material)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{material.name}</CardTitle>
                      <Badge
                        className={
                          material.status === "low"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-green-500/10 text-green-500 border-green-500/20"
                        }
                      >
                        {material.status}
                      </Badge>
                    </div>
                    <CardDescription>{material.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Stock:</span>{" "}
                        <span className="font-medium">
                          {material.stock} {material.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Threshold:</span>{" "}
                        <span className="font-medium">{material.threshold}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Supplier:</span>{" "}
                        <span className="font-medium">{material.supplier}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>{" "}
                        <span className="font-medium">{material.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="edit">
            {selectedMaterial ? (
              <EditMaterialForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                handleSave={handleSave}
                handleDelete={() => handleDelete(selectedMaterial.id)}
                suppliers={inventoryData.suppliers}
                locations={inventoryData.locations}
                categories={inventoryData.categories}
                units={inventoryData.units}
                isEditMode={true}
              />
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">Select a material to edit or add a new one</p>
                <Button variant="outline" onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Material
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <EditMaterialForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleSave={handleSave}
              suppliers={inventoryData.suppliers}
              locations={inventoryData.locations}
              categories={inventoryData.categories}
              units={inventoryData.units}
              isEditMode={false}
            />
          </TabsContent>

          <TabsContent value="deliveries">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pending Deliveries</CardTitle>
                  <CardDescription>Manage upcoming material shipments</CardDescription>
                </div>
                <Button size="sm" onClick={handleAddDelivery}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Delivery
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDeliveries.length > 0 ? (
                      pendingDeliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-medium">{delivery.material}</TableCell>
                          <TableCell>
                            {delivery.quantity} {delivery.unit}
                          </TableCell>
                          <TableCell>{delivery.supplier}</TableCell>
                          <TableCell>{delivery.eta}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEditDelivery(delivery)}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteDelivery(delivery.id)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No pending deliveries
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {isEditMode && selectedMaterial && (
        <div className="space-y-6">
          <EditMaterialForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSave={handleSave}
            handleDelete={() => handleDelete(selectedMaterial.id)}
            suppliers={inventoryData.suppliers}
            locations={inventoryData.locations}
            categories={inventoryData.categories}
            units={inventoryData.units}
            isEditMode={true}
          />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Deliveries</CardTitle>
                <CardDescription>Manage upcoming deliveries for this material</CardDescription>
              </div>
              <Button size="sm" onClick={handleAddDelivery}>
                <Plus className="h-4 w-4 mr-2" />
                Add Delivery
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDeliveries
                    .filter((delivery) => delivery.material === selectedMaterial.name)
                    .map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.material}</TableCell>
                        <TableCell>
                          {delivery.quantity} {delivery.unit}
                        </TableCell>
                        <TableCell>{delivery.supplier}</TableCell>
                        <TableCell>{delivery.eta}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditDelivery(delivery)}>
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteDelivery(delivery.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={deliveryFormOpen} onOpenChange={setDeliveryFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDelivery ? "Edit Delivery" : "Add New Delivery"}</DialogTitle>
            <DialogDescription>
              {editingDelivery
                ? "Update the details of the pending delivery"
                : "Add a new pending delivery to the inventory system"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material" className="text-right">
                Material
              </Label>
              <Select
                value={deliveryForm.material}
                onValueChange={(value) => handleDeliverySelectChange("material", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.name}>
                      {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={deliveryForm.quantity}
                onChange={handleDeliveryInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unit
              </Label>
              <Select value={deliveryForm.unit} onValueChange={(value) => handleDeliverySelectChange("unit", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryData.units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Select
                value={deliveryForm.supplier}
                onValueChange={(value) => handleDeliverySelectChange("supplier", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryData.suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eta" className="text-right">
                ETA
              </Label>
              <Input
                id="eta"
                name="eta"
                placeholder="e.g., Tomorrow, 9:00 AM"
                value={deliveryForm.eta}
                onChange={handleDeliveryInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeliveryFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDelivery}>
              <Save className="h-4 w-4 mr-2" />
              {editingDelivery ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EditMaterialForm({
  formData,
  handleInputChange,
  handleSelectChange,
  handleSave,
  handleDelete,
  suppliers,
  locations,
  categories,
  units,
  isEditMode,
}: {
  formData: any
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (name: string, value: string) => void
  handleSave: () => void
  handleDelete?: () => void
  suppliers: string[]
  locations: string[]
  categories: string[]
  units: string[]
  isEditMode: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Material" : "Add New Material"}</CardTitle>
        <CardDescription>
          {isEditMode ? "Update the details of the selected material" : "Add a new material to inventory"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Material Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Current Stock</Label>
              <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleSelectChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold</Label>
              <Input
                id="threshold"
                name="threshold"
                type="number"
                value={formData.threshold}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={formData.supplier} onValueChange={(value) => handleSelectChange("supplier", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (per unit)</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditMode && handleDelete && (
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {isEditMode ? "Update" : "Save"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

