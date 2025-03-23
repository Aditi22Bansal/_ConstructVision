import InventoryEditForm from "@/components/inventory-edit-form"
import DashboardLayout from "@/components/dashboard-layout"

import { FC } from "react";
interface Props {
  params: { id: string };
}

const InventoryEditPage: FC<Props> = async ({ params }) => {
  // Wait for params to be available
  const materialId = params?.id;

  return (
    <DashboardLayout>
      <InventoryEditForm materialId={materialId} />
    </DashboardLayout>
  );
};

export default InventoryEditPage;


