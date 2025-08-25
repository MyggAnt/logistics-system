import React from 'react';
import OrdersManagement from '../components/OrdersManagement';
import AdminLayout from '../components/AdminLayout';

export default function OrdersPage() {
  return (
    <AdminLayout>
      <OrdersManagement />
    </AdminLayout>
  );
}
