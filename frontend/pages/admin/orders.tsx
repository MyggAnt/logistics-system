import AdminLayout from '../../components/AdminLayout';
import OrdersManagement from '../../components/OrdersManagement';
import { Typography } from 'antd';

const { Title } = Typography;

export default function OrdersPage() {
  return (
    <AdminLayout>
      <Title level={3}>Управление заказами</Title>
      <OrdersManagement />
    </AdminLayout>
  );
}
