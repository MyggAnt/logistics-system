import AdminLayout from '../../components/AdminLayout';
import RouteManagement from '../../components/RouteManagement';
import { Typography } from 'antd';

const { Title } = Typography;

export default function RoutesPage() {
  return (
    <AdminLayout>
      <Title level={3}>Управление маршрутами</Title>
      <RouteManagement />
    </AdminLayout>
  );
}
