import dynamic from 'next/dynamic';
import AdminLayout from '../../components/AdminLayout';
import { Typography } from 'antd';
// Leaflet assets are imported inside the client-only component to avoid SSR window errors

const MapComponent = dynamic<{}>(
  () => import('../../components/MapComponent'),
  { ssr: false }
);

export default function MapPage() {
  return (
    <AdminLayout>
      <Typography.Title level={3}>Карта маршрутов</Typography.Title>
      <MapComponent />
    </AdminLayout>
  );
}
