import AdminLayout from '../../components/AdminLayout';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function SettingsPage() {
  return (
    <AdminLayout>
      <Title level={3}>Настройки</Title>
      <Paragraph type="secondary">Страница в разработке.</Paragraph>
    </AdminLayout>
  );
}


