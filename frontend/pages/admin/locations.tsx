import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Typography, Card, Button, Space, Tag, Row, Col, Statistic, Table, Tree } from 'antd';
import { PlusOutlined, HomeOutlined, FolderOutlined, BarcodeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LocationsPage() {
  const mockLocations = [
    {
      key: '1',
      locationId: 'LOC-001',
      name: 'Склад А',
      type: 'warehouse',
      address: 'Москва, ул. Складская, 1',
      capacity: '10000 м³',
      utilization: 75,
      status: 'active',
      manager: 'Иванов И.И.'
    },
    {
      key: '2',
      locationId: 'LOC-002',
      name: 'Секция 1',
      type: 'section',
      address: 'Склад А, Секция 1',
      capacity: '2000 м³',
      utilization: 80,
      status: 'active',
      manager: 'Петров П.П.'
    },
    {
      key: '3',
      locationId: 'LOC-003',
      name: 'Стеллаж А1',
      type: 'rack',
      address: 'Склад А, Секция 1, Стеллаж А1',
      capacity: '100 м³',
      utilization: 60,
      status: 'active',
      manager: 'Сидоров С.С.'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warehouse': return 'blue';
      case 'section': return 'green';
      case 'rack': return 'orange';
      case 'shelf': return 'purple';
      default: return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'warehouse': return 'Склад';
      case 'section': return 'Секция';
      case 'rack': return 'Стеллаж';
      case 'shelf': return 'Полка';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const columns = [
    {
      title: 'ID местоположения',
      dataIndex: 'locationId',
      key: 'locationId',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>
          {getTypeText(type)}
        </Tag>
      ),
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Емкость',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Загрузка',
      dataIndex: 'utilization',
      key: 'utilization',
      render: (utilization: number) => (
        <Tag color={utilization > 80 ? 'red' : utilization > 60 ? 'orange' : 'green'}>
          {utilization}%
        </Tag>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status === 'active' ? 'Активно' : 'Неактивно'}
        </Tag>
      ),
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

  const treeData = [
    {
      title: 'Склад А',
      key: 'warehouse-a',
      icon: <HomeOutlined />,
      children: [
        {
          title: 'Секция 1',
          key: 'section-1',
          icon: <FolderOutlined />,
          children: [
            {
              title: 'Стеллаж А1',
              key: 'rack-a1',
              icon: <BarcodeOutlined />,
              children: [
                { title: 'Полка 1', key: 'shelf-1' },
                { title: 'Полка 2', key: 'shelf-2' },
                { title: 'Полка 3', key: 'shelf-3' }
              ]
            },
            {
              title: 'Стеллаж А2',
              key: 'rack-a2',
              icon: <BarcodeOutlined />,
              children: [
                { title: 'Полка 1', key: 'shelf-4' },
                { title: 'Полка 2', key: 'shelf-5' }
              ]
            }
          ]
        },
        {
          title: 'Секция 2',
          key: 'section-2',
          icon: <FolderOutlined />,
          children: [
            {
              title: 'Стеллаж Б1',
              key: 'rack-b1',
              icon: <BarcodeOutlined />
            }
          ]
        }
      ]
    }
  ];

  return (
    <AdminLayout>
      <Title level={2}>Адресное хранение</Title>
      
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего местоположений"
              value={mockLocations.length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Склады"
              value={mockLocations.filter(loc => loc.type === 'warehouse').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Секции"
              value={mockLocations.filter(loc => loc.type === 'section').length}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Стеллажи"
              value={mockLocations.filter(loc => loc.type === 'rack').length}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить местоположение
          </Button>
          <Button>
            Экспорт структуры
          </Button>
          <Button>
            Оптимизация размещения
          </Button>
        </Space>
      </Card>

      <Row gutter={16}>
        {/* Tree Structure */}
        <Col xs={24} lg={8}>
          <Card title="Структура хранения" style={{ height: 600 }}>
            <Tree
              showIcon
              defaultExpandAll
              treeData={treeData}
              onSelect={(selectedKeys, info) => {
                console.log('Selected:', selectedKeys, info);
              }}
            />
          </Card>
        </Col>

        {/* Locations Table */}
        <Col xs={24} lg={16}>
          <Card title="Детали местоположений">
            <Table
              columns={columns}
              dataSource={mockLocations}
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}
