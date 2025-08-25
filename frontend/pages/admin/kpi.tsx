import AdminLayout from '../../components/AdminLayout';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import { Typography } from 'antd';

const { Title } = Typography;

export default function KpiPage() {
  return (
    <AdminLayout>
      <Title level={3}>KPI показатели и аналитика</Title>
      <AnalyticsDashboard />
    </AdminLayout>
  );
}
