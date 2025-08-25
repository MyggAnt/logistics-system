import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Typography, Card, Button, Space, Tag, Row, Col, Statistic, Table, Calendar, Badge } from 'antd';
import { PlusOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;

export default function SchedulesPage() {
  const mockSchedules = [
    {
      key: '1',
      scheduleId: 'SCH-001',
      route: 'Москва → Санкт-Петербург',
      vehicle: 'В456ГД77',
      driver: 'Иванов И.И.',
      departureTime: '2024-01-20 08:00',
      arrivalTime: '2024-01-20 18:00',
      status: 'scheduled',
      orders: 15,
      priority: 'high'
    },
    {
      key: '2',
      scheduleId: 'SCH-002',
      route: 'Москва → Калуга',
      vehicle: 'Е789ЖЗ77',
      driver: 'Петров П.П.',
      departureTime: '2024-01-20 09:00',
      arrivalTime: '2024-01-20 14:00',
      status: 'in_progress',
      orders: 8,
      priority: 'medium'
    },
    {
      key: '3',
      scheduleId: 'SCH-003',
      route: 'Москва → Тула',
      vehicle: 'А123БВ77',
      driver: 'Сидоров С.С.',
      departureTime: '2024-01-20 10:00',
      arrivalTime: '2024-01-20 16:00',
      status: 'completed',
      orders: 12,
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'processing';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Запланировано';
      case 'in_progress': return 'В пути';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'ID расписания',
      dataIndex: 'scheduleId',
      key: 'scheduleId',
    },
    {
      title: 'Маршрут',
      dataIndex: 'route',
      key: 'route',
    },
    {
      title: 'Транспорт',
      dataIndex: 'vehicle',
      key: 'vehicle',
    },
    {
      title: 'Водитель',
      dataIndex: 'driver',
      key: 'driver',
    },
    {
      title: 'Время отправления',
      dataIndex: 'departureTime',
      key: 'departureTime',
    },
    {
      title: 'Время прибытия',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
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
      title: 'Приоритет',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'urgent' ? 'Срочно' : 
           priority === 'high' ? 'Высокий' : 
           priority === 'medium' ? 'Средний' : 'Низкий'}
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
          {record.status === 'scheduled' && (
            <Button size="small" type="primary">Начать</Button>
          )}
          {record.status === 'in_progress' && (
            <Button size="small" type="primary">Завершить</Button>
          )}
        </Space>
      ),
    },
  ];

  const getListData = (value: Dayjs) => {
    const listData = [];
    
    // Mock data for specific dates
    if (value.date() === 20) {
      listData.push(
        { type: 'success', content: 'Москва → СПб (15 заказов)' },
        { type: 'warning', content: 'Москва → Калуга (8 заказов)' },
        { type: 'default', content: 'Москва → Тула (12 заказов)' }
      );
    }
    if (value.date() === 21) {
      listData.push(
        { type: 'success', content: 'Москва → Воронеж (10 заказов)' },
        { type: 'default', content: 'Москва → Рязань (6 заказов)' }
      );
    }
    
    return listData;
  };

  const cellRender = (currentDate: Dayjs, info: any) => {
    if (info.type === 'date') {
      const listData = getListData(currentDate);
      return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {listData.map((item, index) => (
            <li key={index}>
              <Badge
                status={item.type as any}
                text={
                  <Text style={{ fontSize: '11px' }}>
                    {item.content}
                  </Text>
                }
              />
            </li>
          ))}
        </ul>
      );
    }
    return info.originNode;
  };

  return (
    <AdminLayout>
      <Title level={2}>Графики доставки</Title>
      
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего расписаний"
              value={mockSchedules.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Запланировано"
              value={mockSchedules.filter(sch => sch.status === 'scheduled').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="В пути"
              value={mockSchedules.filter(sch => sch.status === 'in_progress').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Завершено"
              value={mockSchedules.filter(sch => sch.status === 'completed').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Создать расписание
          </Button>
          <Button>
            Массовое планирование
          </Button>
          <Button>
            Экспорт графика
          </Button>
          <Button>
            Оптимизация маршрутов
          </Button>
        </Space>
      </Card>

      <Row gutter={16}>
        {/* Calendar */}
        <Col xs={24} lg={12}>
          <Card title="Календарь доставок">
            <Calendar
              cellRender={cellRender}
              style={{ height: 400 }}
            />
          </Card>
        </Col>

        {/* Schedules Table */}
        <Col xs={24} lg={12}>
          <Card title="Расписание на сегодня">
            <Table
              columns={columns.filter(col => col.key !== 'actions')}
              dataSource={mockSchedules}
              pagination={false}
              size="small"
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Full Schedules Table */}
      <Card title="Полное расписание" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={mockSchedules}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>
    </AdminLayout>
  );
}
