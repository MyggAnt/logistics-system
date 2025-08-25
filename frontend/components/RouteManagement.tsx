import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, DatePicker, Tag, message, Card, Row, Col, Progress, Tooltip, Badge, Timeline } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, CarOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

interface RouteData {
  key: string;
  id: string;
  routeId: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  vehicleId: string;
  driverName: string;
  startWarehouseId: string;
  endWarehouseId: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  totalDistance: number;
  estimatedDuration: number;
  actualDuration?: number;
  estimatedFuelConsumption: number;
  actualFuelConsumption?: number;
  estimatedCost: number;
  actualCost?: number;
  trafficConditions: 'good' | 'moderate' | 'heavy' | 'congested';
  weatherConditions: 'clear' | 'rainy' | 'snowy' | 'foggy';
  totalOrders: number;
  totalWeight: number;
  totalVolume: number;
  notes: string;
}

const mockData: RouteData[] = [
  {
    key: '1',
    id: '1',
    routeId: 'RT-001',
    name: 'Москва → Санкт-Петербург',
    description: 'Доставка товаров в гипермаркет СПб',
    status: 'active',
    vehicleId: 'VEH-001',
    driverName: 'Иванов И.И.',
    startWarehouseId: 'WH-001',
    endWarehouseId: 'WH-002',
    plannedStartDate: '2024-01-15 08:00',
    plannedEndDate: '2024-01-16 18:00',
    actualStartDate: '2024-01-15 08:15',
    totalDistance: 650,
    estimatedDuration: 10,
    estimatedFuelConsumption: 65,
    estimatedCost: 15000,
    trafficConditions: 'moderate',
    weatherConditions: 'clear',
    totalOrders: 15,
    totalWeight: 2500,
    totalVolume: 25,
    notes: 'Маршрут проходит по М-10',
  },
  {
    key: '2',
    id: '2',
    routeId: 'RT-002',
    name: 'Москва → Казань',
    description: 'Доставка в региональный склад',
    status: 'planning',
    vehicleId: 'VEH-002',
    driverName: 'Петров П.П.',
    startWarehouseId: 'WH-001',
    endWarehouseId: 'WH-003',
    plannedStartDate: '2024-01-17 06:00',
    plannedEndDate: '2024-01-18 12:00',
    totalDistance: 800,
    estimatedDuration: 18,
    estimatedFuelConsumption: 80,
    estimatedCost: 18000,
    trafficConditions: 'good',
    weatherConditions: 'clear',
    totalOrders: 8,
    totalWeight: 1800,
    totalVolume: 18,
    notes: 'Планируется ночная доставка',
  },
  {
    key: '3',
    id: '3',
    routeId: 'RT-003',
    name: 'Москва → Нижний Новгород',
    description: 'Доставка скоропортящихся товаров',
    status: 'completed',
    vehicleId: 'VEH-003',
    driverName: 'Сидоров С.С.',
    startWarehouseId: 'WH-001',
    endWarehouseId: 'WH-004',
    plannedStartDate: '2024-01-14 10:00',
    plannedEndDate: '2024-01-14 22:00',
    actualStartDate: '2024-01-14 10:05',
    actualEndDate: '2024-01-14 21:30',
    totalDistance: 400,
    estimatedDuration: 12,
    actualDuration: 11.5,
    estimatedFuelConsumption: 40,
    actualFuelConsumption: 38,
    estimatedCost: 12000,
    actualCost: 11500,
    trafficConditions: 'good',
    weatherConditions: 'clear',
    totalOrders: 12,
    totalWeight: 1200,
    totalVolume: 12,
    notes: 'Доставка выполнена раньше срока',
  },
];

const statusColors = {
  planning: 'blue',
  active: 'green',
  completed: 'cyan',
  cancelled: 'red',
};

const statusLabels = {
  planning: 'Планирование',
  active: 'В пути',
  completed: 'Завершен',
  cancelled: 'Отменен',
};

const trafficColors = {
  good: 'green',
  moderate: 'orange',
  heavy: 'red',
  congested: 'red',
};

const trafficLabels = {
  good: 'Хорошие',
  moderate: 'Умеренные',
  heavy: 'Плохие',
  congested: 'Пробки',
};

const weatherColors = {
  clear: 'blue',
  rainy: 'cyan',
  snowy: 'white',
  foggy: 'gray',
};

const weatherLabels = {
  clear: 'Ясно',
  rainy: 'Дождь',
  snowy: 'Снег',
  foggy: 'Туман',
};

export default function RouteManagement() {
  const [data, setData] = useState<RouteData[]>(mockData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteData | null>(null);
  const [form] = Form.useForm();

  const getRouteProgress = (route: RouteData) => {
    if (route.status === 'completed') return 100;
    if (route.status === 'active') return 50;
    if (route.status === 'planning') return 0;
    return 0;
  };

  const getRouteStatus = (route: RouteData) => {
    if (route.status === 'completed') return 'success';
    if (route.status === 'active') return 'active';
    if (route.status === 'planning') return 'normal';
    return 'exception';
  };

  const columns: ColumnsType<RouteData> = [
    {
      title: 'ID маршрута',
      dataIndex: 'routeId',
      key: 'routeId',
      sorter: (a, b) => a.routeId.localeCompare(b.routeId),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <div>
          <Tag color={statusColors[status as keyof typeof statusColors]}>
            {statusLabels[status as keyof typeof statusLabels]}
          </Tag>
          <div style={{ marginTop: 4 }}>
            <Progress
              percent={getRouteProgress({ status } as RouteData)}
              size="small"
              status={getRouteStatus({ status } as RouteData)}
              format={(percent) => `${percent}%`}
            />
          </div>
        </div>
      ),
      filters: Object.entries(statusLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Транспорт',
      key: 'transport',
      render: (_, record) => (
        <div>
          <div>
            <CarOutlined /> {record.vehicleId}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.driverName}
          </div>
        </div>
      ),
    },
    {
      title: 'Маршрут',
      key: 'route',
      render: (_, record) => (
        <div>
          <div>
            <EnvironmentOutlined /> {record.startWarehouseId} → {record.endWarehouseId}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.totalDistance} км
          </div>
        </div>
      ),
    },
    {
      title: 'Время',
      key: 'time',
      render: (_, record) => (
        <div>
          <div>
            <ClockCircleOutlined /> {record.plannedStartDate}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            План: {record.estimatedDuration}ч
            {record.actualDuration && ` / Факт: ${record.actualDuration}ч`}
          </div>
        </div>
      ),
    },
    {
      title: 'Груз',
      key: 'cargo',
      render: (_, record) => (
        <div>
          <div>Заказы: {record.totalOrders}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.totalWeight} кг / {record.totalVolume} м³
          </div>
        </div>
      ),
    },
    {
      title: 'Условия',
      key: 'conditions',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={trafficColors[record.trafficConditions]}>
            Дорога: {trafficLabels[record.trafficConditions]}
          </Tag>
          <Tag color={weatherColors[record.weatherConditions]}>
            Погода: {weatherLabels[record.weatherConditions]}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Стоимость',
      key: 'cost',
      render: (_, record) => (
        <div>
          <div>План: {record.estimatedCost.toLocaleString()} ₽</div>
          {record.actualCost && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              Факт: {record.actualCost.toLocaleString()} ₽
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Топливо',
      key: 'fuel',
      render: (_, record) => (
        <div>
          <div>План: {record.estimatedFuelConsumption} л</div>
          {record.actualFuelConsumption && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              Факт: {record.actualFuelConsumption} л
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Редактировать
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRoute(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (route: RouteData) => {
    setEditingRoute(route);
    form.setFieldsValue(route);
    setIsModalVisible(true);
  };

  const handleDelete = (route: RouteData) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: `Вы уверены, что хотите удалить маршрут "${route.name}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        setData(data.filter(item => item.key !== route.key));
        message.success('Маршрут успешно удален');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRoute) {
        // Обновление существующего маршрута
        setData(data.map(item =>
          item.key === editingRoute.key ? { ...item, ...values } : item
        ));
        message.success('Маршрут успешно обновлен');
      } else {
        // Создание нового маршрута
        const newRoute: RouteData = {
          key: Date.now().toString(),
          id: Date.now().toString(),
          routeId: `RT-${String(data.length + 1).padStart(3, '0')}`,
          ...values,
        };
        setData([...data, newRoute]);
        message.success('Маршрут успешно создан');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <h2>Управление маршрутами</h2>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Добавить маршрут
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} из ${total} маршрутов`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title={editingRoute ? 'Редактировать маршрут' : 'Добавить маршрут'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1000}
        okText={editingRoute ? 'Обновить' : 'Создать'}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'planning',
            trafficConditions: 'good',
            weatherConditions: 'clear',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Название маршрута"
                rules={[{ required: true, message: 'Введите название маршрута' }]}
              >
                <Input placeholder="Введите название" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Статус"
                rules={[{ required: true, message: 'Выберите статус' }]}
              >
                <Select placeholder="Выберите статус">
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Описание"
              >
                <TextArea rows={2} placeholder="Введите описание маршрута" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="vehicleId"
                label="ID транспортного средства"
                rules={[{ required: true, message: 'Введите ID ТС' }]}
              >
                <Input placeholder="Введите ID ТС" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="driverName"
                label="Имя водителя"
                rules={[{ required: true, message: 'Введите имя водителя' }]}
              >
                <Input placeholder="Введите ФИО водителя" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startWarehouseId"
                label="Склад отправления"
                rules={[{ required: true, message: 'Введите ID склада отправления' }]}
              >
                <Input placeholder="Введите ID склада" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endWarehouseId"
                label="Склад назначения"
                rules={[{ required: true, message: 'Введите ID склада назначения' }]}
              >
                <Input placeholder="Введите ID склада" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="plannedStartDate"
                label="Планируемое время отправления"
                rules={[{ required: true, message: 'Выберите время отправления' }]}
              >
                <Input placeholder="YYYY-MM-DD HH:MM" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="plannedEndDate"
                label="Планируемое время прибытия"
                rules={[{ required: true, message: 'Выберите время прибытия' }]}
              >
                <Input placeholder="YYYY-MM-DD HH:MM" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="totalDistance"
                label="Расстояние (км)"
                rules={[{ required: true, message: 'Введите расстояние' }]}
              >
                <Input type="number" placeholder="Введите расстояние" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="estimatedDuration"
                label="Планируемая длительность (часы)"
                rules={[{ required: true, message: 'Введите длительность' }]}
              >
                <Input type="number" placeholder="Введите часы" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="estimatedFuelConsumption"
                label="Планируемый расход топлива (л)"
                rules={[{ required: true, message: 'Введите расход топлива' }]}
              >
                <Input type="number" placeholder="Введите литры" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="estimatedCost"
                label="Планируемая стоимость (₽)"
                rules={[{ required: true, message: 'Введите стоимость' }]}
              >
                <Input type="number" placeholder="Введите стоимость" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalOrders"
                label="Количество заказов"
                rules={[{ required: true, message: 'Введите количество заказов' }]}
              >
                <Input type="number" placeholder="Введите количество" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalWeight"
                label="Общий вес (кг)"
                rules={[{ required: true, message: 'Введите вес' }]}
              >
                <Input type="number" placeholder="Введите вес" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="totalVolume"
                label="Общий объем (м³)"
                rules={[{ required: true, message: 'Введите объем' }]}
              >
                <Input type="number" step="0.1" placeholder="Введите объем" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="trafficConditions"
                label="Дорожные условия"
                rules={[{ required: true, message: 'Выберите дорожные условия' }]}
              >
                <Select placeholder="Выберите условия">
                  {Object.entries(trafficLabels).map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="weatherConditions"
                label="Погодные условия"
                rules={[{ required: true, message: 'Выберите погодные условия' }]}
              >
                <Select placeholder="Выберите условия">
                  {Object.entries(weatherLabels).map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="notes"
                label="Примечания"
              >
                <TextArea rows={3} placeholder="Введите примечания к маршруту" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
