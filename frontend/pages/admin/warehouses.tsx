import AdminLayout from '../../components/AdminLayout';
import WarehouseManagement from '../../components/WarehouseManagement';
import { Typography } from 'antd';

const { Title } = Typography;

export default function WarehousesPage() {
  return (
    <AdminLayout>
      <Title level={3}>Управление складами и РЦ</Title>
      <WarehouseManagement />
    </AdminLayout>
  );
}
