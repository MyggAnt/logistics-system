import AdminLayout from '../../components/AdminLayout';
import ReturnManagement from '../../components/ReturnManagement';
import { Typography } from 'antd';

const { Title } = Typography;

export default function ReturnsPage() {
  return (
    <AdminLayout>
      <Title level={3}>Управление возвратами</Title>
      <ReturnManagement />
    </AdminLayout>
  );
}
