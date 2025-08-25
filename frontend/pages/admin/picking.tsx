import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Typography, Card, Button, Space, Tag, Row, Col, Statistic, Table, Progress } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function PickingPage() {
  const mockPickingLists = [
    {
      key: '1',
      listId: 'PL001',
      orderId: 'ORD-001',
      customer: 'ООО Компания А',
      items: 5,
      totalQuantity: 25,
      assignedTo: 'Иванов И.И.',
      status: 'in_progress',
      progress: 60,
      createdAt: '2024-01-15 09:00',
      deadline: '2024-01-15 17:00'
    },
    {
      key: '2',
      listId: 'PL002',
      orderId: 'ORD-002',
      customer: 'ИП Петров',
      items: 3,
      totalQuantity: 12,
      assignedTo: 'Сидоров С.С.',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-15 08:30',
      deadline: '2024-01-15 16:00'
    },
    {
      key: '3',
      listId: 'PL003',
      orderId: 'ORD-003',
      customer: 'ООО ТехноМир',
      items: 8,
      totalQuantity: 45,
      assignedTo: 'Козлов К.К.',
      status: 'pending',
      progress: 0,
      createdAt: '2024-01-15 10:00',
      deadline: '2024-01-15 18:00'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'in_progress': return 'processing';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершено';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'ID списка',
      dataIndex: 'listId',
      key: 'listId',
    },
    {
      title: 'Заказ',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Клиент',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Товары',
      dataIndex: 'items',
      key: 'items',
      render: (items: number, record: any) => `${items} (${record.totalQuantity} шт)`,
    },
    {
      title: 'Исполнитель',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo: string) => (
        <Space>
          <UserOutlined />
          <Text>{assignedTo}</Text>
        </Space>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Прогресс',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress === 100 ? 'success' : 'active'}
        />
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small" type="link">Просмотр</Button>
          {record.status === 'pending' && (
            <Button size="small" type="primary">Начать</Button>
          )}
          {record.status === 'in_progress' && (
            <Button size="small" type="primary">Завершить</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Title level={2}>Сборочные листы (Picking Lists)</Title>
      
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего списков"
              value={mockPickingLists.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="В работе"
              value={mockPickingLists.filter(list => list.status === 'in_progress').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Завершено"
              value={mockPickingLists.filter(list => list.status === 'completed').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ожидает"
              value={mockPickingLists.filter(list => list.status === 'pending').length}
              valueStyle={{ color: '#666' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Создать сборочный лист
          </Button>
          <Button>
            Экспорт данных
          </Button>
          <Button>
            Назначить исполнителей
          </Button>
        </Space>
      </Card>

      {/* Picking Lists Table */}
      <Card title="Сборочные листы">
        <Table
          columns={columns}
          dataSource={mockPickingLists}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>
    </AdminLayout>
  );
}
