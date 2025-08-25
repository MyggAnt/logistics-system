import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Typography, Card, Button, Space, Tag, Row, Col, Statistic, Table, Avatar } from 'antd';
import { PlusOutlined, UserOutlined, CarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function DriversPage() {
  const mockDrivers = [
    {
      key: '1',
      driverId: 'DRV-001',
      name: 'Иванов Иван Иванович',
      licenseNumber: '77 АА 123456',
      licenseType: 'C',
      experience: '5 лет',
      status: 'available',
      currentVehicle: 'В456ГД77',
      currentRoute: 'Москва → Санкт-Петербург',
      rating: 4.8,
      totalDeliveries: 156
    },
    {
      key: '2',
      driverId: 'DRV-002',
      name: 'Петров Петр Петрович',
      licenseNumber: '77 ББ 789012',
      licenseType: 'C',
      experience: '3 года',
      status: 'on_delivery',
      currentVehicle: 'Е789ЖЗ77',
      currentRoute: 'Москва → Калуга',
      rating: 4.6,
      totalDeliveries: 89
    },
    {
      key: '3',
      driverId: 'DRV-003',
      name: 'Сидоров Сидор Сидорович',
      licenseNumber: '77 ВВ 345678',
      licenseType: 'C',
      experience: '7 лет',
      status: 'off_duty',
      currentVehicle: null,
      currentRoute: null,
      rating: 4.9,
      totalDeliveries: 234
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'on_delivery': return 'processing';
      case 'off_duty': return 'default';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Доступен';
      case 'on_delivery': return 'В доставке';
      case 'off_duty': return 'Не на смене';
      case 'maintenance': return 'Обслуживание';
      default: return status;
    }
  };

  const getLicenseTypeText = (type: string) => {
    switch (type) {
      case 'A': return 'Мотоциклы';
      case 'B': return 'Легковые автомобили';
      case 'C': return 'Грузовые автомобили';
      case 'D': return 'Автобусы';
      default: return type;
    }
  };

  const columns = [
    {
      title: 'ID водителя',
      dataIndex: 'driverId',
      key: 'driverId',
    },
    {
      title: 'Водитель',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Номер прав',
      dataIndex: 'licenseNumber',
      key: 'licenseNumber',
    },
    {
      title: 'Категория',
      dataIndex: 'licenseType',
      key: 'licenseType',
      render: (type: string) => (
        <Tag color="blue">
          {type} - {getLicenseTypeText(type)}
        </Tag>
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
      title: 'Текущий ТС',
      dataIndex: 'currentVehicle',
      key: 'currentVehicle',
      render: (vehicle: string | null) => (
        vehicle ? (
          <Space>
            <CarOutlined />
            <Text>{vehicle}</Text>
          </Space>
        ) : (
          <Text type="secondary">Не назначен</Text>
        )
      ),
    },
    {
      title: 'Рейтинг',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Tag color={rating >= 4.5 ? 'success' : rating >= 4.0 ? 'warning' : 'error'}>
          {rating}/5.0
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small" type="link">Просмотр</Button>
          <Button size="small" type="link">Редактировать</Button>
          {record.status === 'available' && (
            <Button size="small" type="primary">Назначить маршрут</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Title level={2}>Управление водителями</Title>
      
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего водителей"
              value={mockDrivers.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Доступны"
              value={mockDrivers.filter(driver => driver.status === 'available').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="В доставке"
              value={mockDrivers.filter(driver => driver.status === 'on_delivery').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Не на смене"
              value={mockDrivers.filter(driver => driver.status === 'off_duty').length}
              valueStyle={{ color: '#666' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить водителя
          </Button>
          <Button>
            Назначить маршруты
          </Button>
          <Button>
            Экспорт данных
          </Button>
          <Button>
            График смен
          </Button>
        </Space>
      </Card>

      {/* Drivers Table */}
      <Card title="Список водителей">
        <Table
          columns={columns}
          dataSource={mockDrivers}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>
    </AdminLayout>
  );
}
