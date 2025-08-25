import AdminLayout from '../../components/AdminLayout';
import FinancialManagement from '../../components/FinancialManagement';
import { Typography } from 'antd';

const { Title } = Typography;

export default function FinancialPage() {
  return (
    <AdminLayout>
      <Title level={3}>Финансовое управление</Title>
      <FinancialManagement />
    </AdminLayout>
  );
}
