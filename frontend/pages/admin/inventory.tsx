import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Typography, Card, Button, Space, Tag, Row, Col, Statistic, Table } from 'antd';
import { PlusOutlined, ReloadOutlined, BarcodeOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function InventoryPage() {
  const mockInventory = [
    {
      key: '1',
      productId: 'P001',
      productName: 'Товар 1',
      category: 'Электроника',
      quantity: 150,
      unit: 'шт',
      location: 'Склад А, Секция 1',
      lastUpdated: '2024-01-15',
      status: 'available'
    },
    {
      key: '2',
      productId: 'P002',
      productName: 'Товар 2',
      category: 'Одежда',
      quantity: 75,
      unit: 'шт',
      location: 'Склад Б, Секция 2',
      lastUpdated: '2024-01-14',
      status: 'low'
    },
    {
      key: '3',
      productId: 'P003',
      productName: 'Товар 3',
      category: 'Продукты',
      quantity: 200,
      unit: 'кг',
      location: 'Склад В, Секция 3',
      lastUpdated: '2024-01-13',
      status: 'available'
    }
  ];

  const columns = [
    {
      title: 'ID товара',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Название',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: any) => `${quantity} ${record.unit}`,
    },
    {
      title: 'Местоположение',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'available' ? 'success' : status === 'low' ? 'warning' : 'error';
        const text = status === 'available' ? 'Доступно' : status === 'low' ? 'Мало' : 'Отсутствует';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" type="link">Просмотр</Button>
          <Button size="small" type="link">Редактировать</Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Title level={2}>Управление инвентаризацией</Title>
      
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего товаров"
              value={mockInventory.length}
              prefix={<BarcodeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Доступно"
              value={mockInventory.filter(item => item.status === 'available').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Мало товара"
              value={mockInventory.filter(item => item.status === 'low').length}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Отсутствует"
              value={mockInventory.filter(item => item.status === 'out').length}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Новая инвентаризация
          </Button>
          <Button icon={<ReloadOutlined />}>
            Обновить данные
          </Button>
          <Button icon={<SearchOutlined />}>
            Поиск товаров
          </Button>
        </Space>
      </Card>

      {/* Inventory Table */}
      <Card title="Текущий инвентарь">
        <Table
          columns={columns}
          dataSource={mockInventory}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>
    </AdminLayout>
  );
}
