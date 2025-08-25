import AdminLayout from '../../components/AdminLayout';
import UserManagement from '../../components/UserManagement';
import { Typography } from 'antd';

const { Title } = Typography;

export default function UsersPage() {
  return (
    <AdminLayout>
      <Title level={3}>Управление пользователями и безопасностью</Title>
      <UserManagement />
    </AdminLayout>
  );
}
