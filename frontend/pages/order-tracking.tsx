import React from 'react';
import OrderTracking from '../components/OrderTracking';
import AdminLayout from '../components/AdminLayout';

export default function OrderTrackingPage() {
  return (
    <AdminLayout>
      <OrderTracking />
    </AdminLayout>
  );
}
