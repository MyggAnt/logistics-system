import AdminLayout from '../../components/AdminLayout';
import ProductManagement from '../../components/ProductManagement';
import { Typography } from 'antd';

const { Title } = Typography;

export default function ProductsPage() {
  return (
    <AdminLayout>
      <Title level={3}>Управление товарами и запасами</Title>
      <ProductManagement />
    </AdminLayout>
  );
}
