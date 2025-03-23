import InventoryEditForm from "@/components/inventory-edit-form"
import DashboardLayout from "@/components/dashboard-layout"

export default function InventoryItemEditPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <InventoryEditForm materialId={params.id} />
    </DashboardLayout>
  )
}

