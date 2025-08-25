import React from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { Typography, Card, Button, Space, Tag, Row, Col, Statistic } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, GroupOutlined, TruckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function LogisticsBatchesPage() {
  const router = useRouter();

  const mockBatches = [
    {
      id: 'B001',
      name: 'Партия Москва-СПб',
      status: 'active',
      totalOrders: 15,
      totalWeight: 2500,
      totalVolume: 45,
      plannedDelivery: '2024-01-20',
      route: 'Москва → Санкт-Петербург'
    },
    {
      id: 'B002',
      name: 'Партия Центр',
      status: 'planning',
      totalOrders: 8,
      totalWeight: 1200,
      totalVolume: 22,
      plannedDelivery: '2024-01-22',
      route: 'Москва → Калуга → Тула'
    },
    {
      id: 'B003',
      name: 'Партия Юг',
      status: 'completed',
      totalOrders: 12,
      totalWeight: 1800,
      totalVolume: 35,
      plannedDelivery: '2024-01-18',
      route: 'Москва → Воронеж → Ростов'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'processing';
      case 'planning': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'В пути';
      case 'planning': return 'Планирование';
      case 'completed': return 'Завершено';
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          style={{ marginBottom: 16 }}
        >
          Назад к заказам
        </Button>
        <Title level={2}>Логистические партии</Title>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего партий"
              value={mockBatches.length}
              prefix={<GroupOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Активные партии"
              value={mockBatches.filter(b => b.status === 'active').length}
              prefix={<TruckOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="В планировании"
              value={mockBatches.filter(b => b.status === 'planning').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Завершено"
              value={mockBatches.filter(b => b.status === 'completed').length}
              prefix={<GroupOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Создать новую партию
          </Button>
          <Button>
            Экспорт данных
          </Button>
        </Space>
      </Card>

      {/* Batches List */}
      <Row gutter={[16, 16]}>
        {mockBatches.map((batch) => (
          <Col xs={24} lg={8} key={batch.id}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>{batch.name}</Text>
                  <Tag color={getStatusColor(batch.status)}>
                    {getStatusText(batch.status)}
                  </Tag>
                </div>
              }
              extra={
                <Space>
                  <Button size="small">Просмотр</Button>
                  <Button size="small" type="primary">Редактировать</Button>
                </Space>
              }
            >
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">ID: {batch.id}</Text>
              </div>
              
              <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Text strong>Заказов:</Text>
                </Col>
                <Col span={12}>
                  <Text>{batch.totalOrders}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Вес (кг):</Text>
                </Col>
                <Col span={12}>
                  <Text>{batch.totalWeight}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Объем (м³):</Text>
                </Col>
                <Col span={12}>
                  <Text>{batch.totalVolume}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>План доставки:</Text>
                </Col>
                <Col span={12}>
                  <Text>{batch.plannedDelivery}</Text>
                </Col>
              </Row>

              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                  <strong>Маршрут:</strong> {batch.route}
                </Text>
              </div>

              <Space>
                <Button size="small" type="link">
                  Детали
                </Button>
                <Button size="small" type="link">
                  Заказы
                </Button>
                <Button size="small" type="link">
                  Маршрут
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </AdminLayout>
  );
}
