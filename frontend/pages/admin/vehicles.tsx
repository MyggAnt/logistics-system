import AdminLayout from '../../components/AdminLayout';
import VehicleManagement from '../../components/VehicleManagement';
import { Typography } from 'antd';

const { Title } = Typography;

export default function VehiclesPage() {
  return (
    <AdminLayout>
      <Title level={3}>Управление транспортными средствами</Title>
      <VehicleManagement />
    </AdminLayout>
  );
}
