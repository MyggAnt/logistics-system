import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Statistic, 
  Progress, 
  Badge,
  Tabs,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  message,
  Tooltip,
  Avatar,
  Divider
} from 'antd';
import { 
  GlobalOutlined, 
  ChromeOutlined, 
  BarcodeOutlined,
  CarOutlined,
  CloudOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SettingOutlined,
  SignalFilled,
  BarsOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

// Моковые данные для демонстрации
const mockGpsTrackers = [
  {
    id: 1,
    trackerId: 'GPS-001',
    name: 'GPS Трекер Грузовик 1',
    status: 'active',
    vehicle: 'Грузовик Volvo FH16',
    lastSignalTime: '2024-01-15T10:30:00Z',
    lastLatitude: 55.7558,
    lastLongitude: 37.6176,
    lastSpeed: 65,
    batteryLevel: 85,
    signalStrength: -45,
    isMoving: true,
    currentLocation: 'Москва, Ленинградский проспект'
  },
  {
    id: 2,
    trackerId: 'GPS-002',
    name: 'GPS Трекер Грузовик 2',
    status: 'active',
    vehicle: 'Грузовик Mercedes Actros',
    lastSignalTime: '2024-01-15T10:28:00Z',
    lastLatitude: 55.7500,
    lastLongitude: 37.6200,
    lastSpeed: 0,
    batteryLevel: 92,
    signalStrength: -52,
    isMoving: false,
    currentLocation: 'Москва, Тверская улица'
  }
];

const mockTemperatureSensors = [
  {
    id: 1,
    sensorId: 'TEMP-001',
    name: 'Температурный сенсор - Грузовой отсек',
    location: 'cargo_area',
    status: 'active',
    vehicle: 'Грузовик Volvo FH16',
    currentTemperature: 4.2,
    targetTemperature: 4.0,
    humidity: 65,
    batteryLevel: 78,
    lastReadingTime: '2024-01-15T10:30:00Z',
    isAlert: false
  },
  {
    id: 2,
    sensorId: 'TEMP-002',
    name: 'Температурный сенсор - Рефрижератор',
    location: 'refrigerator',
    status: 'active',
    vehicle: 'Грузовик Mercedes Actros',
    currentTemperature: -18.5,
    targetTemperature: -18.0,
    humidity: 45,
    batteryLevel: 91,
    lastReadingTime: '2024-01-15T10:29:00Z',
    isAlert: false
  },
  {
    id: 3,
    sensorId: 'TEMP-003',
    name: 'Температурный сенсор - Двигатель',
    location: 'engine',
    status: 'alert',
    vehicle: 'Грузовик Volvo FH16',
    currentTemperature: 95.8,
    targetTemperature: 85.0,
    humidity: 30,
    batteryLevel: 65,
    lastReadingTime: '2024-01-15T10:30:00Z',
    isAlert: true,
    alertMessage: 'Температура двигателя превышает норму'
  }
];

const mockRfidSystems = [
  {
    id: 1,
    systemId: 'RFID-001',
    name: 'RFID Ридер - Вход на склад',
    type: 'reader',
    status: 'active',
    location: 'Склад №1 - Вход',
    frequency: 915,
    readRange: 8,
    lastReadTime: '2024-01-15T10:30:00Z',
    lastReadTagId: 'TAG-001',
    readCount: 1247,
    errorCount: 3
  },
  {
    id: 2,
    systemId: 'RFID-002',
    name: 'RFID Тег - Паллета №1',
    type: 'tag',
    status: 'active',
    location: 'Склад №1 - Секция А',
    lastReadTime: '2024-01-15T10:25:00Z',
    lastReadTagId: 'TAG-001'
  },
  {
    id: 3,
    systemId: 'RFID-003',
    name: 'RFID Ворота - Выезд со склада',
    type: 'gate',
    status: 'active',
    location: 'Склад №1 - Выезд',
    frequency: 915,
    readRange: 12,
    lastReadTime: '2024-01-15T10:28:00Z',
    lastReadTagId: 'TAG-002',
    readCount: 892,
    errorCount: 1
  }
];

// Данные для графиков
const temperatureChartData = [
  { time: '08:00', temp: 4.2, humidity: 65 },
  { time: '09:00', temp: 4.1, humidity: 66 },
  { time: '10:00', temp: 4.2, humidity: 65 },
  { time: '11:00', temp: 4.3, humidity: 64 },
  { time: '12:00', temp: 4.5, humidity: 63 },
  { time: '13:00', temp: 4.4, humidity: 64 },
  { time: '14:00', temp: 4.2, humidity: 65 }
];

const gpsChartData = [
  { time: '08:00', speed: 0, battery: 85 },
  { time: '09:00', speed: 45, battery: 84 },
  { time: '10:00', speed: 65, battery: 83 },
  { time: '11:00', speed: 0, battery: 82 },
  { time: '12:00', speed: 55, battery: 81 },
  { time: '13:00', speed: 70, battery: 80 },
  { time: '14:00', speed: 0, battery: 79 }
];

export default function SensorsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [form] = Form.useForm();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
      case 'error': return 'error';
      case 'low_battery': return 'warning';
      case 'calibration_needed': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleOutlined />;
      case 'inactive': return <ClockCircleOutlined />;
      case 'maintenance': return <SyncOutlined />;
      case 'error': return <ExclamationCircleOutlined />;
      case 'low_battery': return <BarsOutlined />;
      case 'calibration_needed': return <SettingOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'cargo_area': return <CarOutlined />;
      case 'engine': return <ChromeOutlined />;
      case 'refrigerator': return <CloudOutlined />;
      case 'external': return <EnvironmentOutlined />;
      case 'driver_cabin': return <CarOutlined />;
      default: return <EnvironmentOutlined />;
    }
  };

  const gpsColumns = [
    {
      title: 'ID Трекера',
      dataIndex: 'trackerId',
      key: 'trackerId',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status === 'active' ? 'Активен' : 
           status === 'inactive' ? 'Неактивен' : 
           status === 'maintenance' ? 'Обслуживание' : 
           status === 'error' ? 'Ошибка' : 
           status === 'low_battery' ? 'Низкий заряд' : status}
        </Tag>
      )
    },
    {
      title: 'Транспорт',
      dataIndex: 'vehicle',
      key: 'vehicle'
    },
    {
      title: 'Последний сигнал',
      dataIndex: 'lastSignalTime',
      key: 'lastSignalTime',
      render: (time: string) => new Date(time).toLocaleString('ru-RU')
    },
    {
      title: 'Координаты',
      key: 'coordinates',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text type="secondary">Ш: {record.lastLatitude?.toFixed(6)}</Text>
          <Text type="secondary">Д: {record.lastLongitude?.toFixed(6)}</Text>
        </Space>
      )
    },
    {
      title: 'Скорость',
      dataIndex: 'lastSpeed',
      key: 'lastSpeed',
      render: (speed: number) => (
        <Space>
          <ThunderboltOutlined />
          <Text>{speed} км/ч</Text>
        </Space>
      )
    },
    {
      title: 'Заряд',
      dataIndex: 'batteryLevel',
      key: 'batteryLevel',
      render: (level: number) => (
        <Space>
          <BarsOutlined />
          <Progress percent={level} size="small" showInfo={false} />
          <Text>{level}%</Text>
        </Space>
      )
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Tooltip title="Просмотр">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Tooltip>
        </Space>
      )
    }
  ];

  const temperatureColumns = [
    {
      title: 'ID Сенсора',
      dataIndex: 'sensorId',
      key: 'sensorId',
      render: (text: string) => <Tag color="green">{text}</Tag>
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Расположение',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <Space>
          {getLocationIcon(location)}
          <Text>{location === 'cargo_area' ? 'Грузовой отсек' :
                 location === 'engine' ? 'Двигатель' :
                 location === 'refrigerator' ? 'Рефрижератор' :
                 location === 'external' ? 'Внешний' :
                 location === 'driver_cabin' ? 'Кабина водителя' : location}</Text>
        </Space>
      )
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status === 'active' ? 'Активен' : 
           status === 'inactive' ? 'Неактивен' : 
           status === 'maintenance' ? 'Обслуживание' : 
           status === 'error' ? 'Ошибка' : 
           status === 'calibration_needed' ? 'Требует калибровки' : status}
        </Tag>
      )
    },
    {
      title: 'Температура',
      key: 'temperature',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.currentTemperature}°C</Text>
          {record.targetTemperature && (
            <Text type="secondary">Цель: {record.targetTemperature}°C</Text>
          )}
        </Space>
      )
    },
    {
      title: 'Влажность',
      dataIndex: 'humidity',
      key: 'humidity',
      render: (humidity: number) => `${humidity}%`
    },
    {
      title: 'Заряд',
      dataIndex: 'batteryLevel',
      key: 'batteryLevel',
      render: (level: number) => (
        <Space>
          <BarsOutlined />
          <Progress percent={level} size="small" showInfo={false} />
          <Text>{level}%</Text>
        </Space>
      )
    },
    {
      title: 'Последнее обновление',
      dataIndex: 'lastReadingTime',
      key: 'lastReadingTime',
      render: (time: string) => new Date(time).toLocaleString('ru-RU')
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Tooltip title="Просмотр">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Tooltip>
        </Space>
      )
    }
  ];

  const rfidColumns = [
    {
      title: 'ID Системы',
      dataIndex: 'systemId',
      key: 'systemId',
      render: (text: string) => <Tag color="purple">{text}</Tag>
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'reader' ? 'blue' : type === 'tag' ? 'green' : type === 'gate' ? 'orange' : 'purple'}>
          {type === 'reader' ? 'Ридер' : 
           type === 'tag' ? 'Тег' : 
           type === 'gate' ? 'Ворота' : 
           type === 'antenna' ? 'Антенна' : type}
        </Tag>
      )
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status === 'active' ? 'Активен' : 
           status === 'inactive' ? 'Неактивен' : 
           status === 'maintenance' ? 'Обслуживание' : 
           status === 'error' ? 'Ошибка' : status}
        </Tag>
      )
    },
    {
      title: 'Расположение',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Частота',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (freq: number) => freq ? `${freq} МГц` : '-'
    },
    {
      title: 'Дальность',
      dataIndex: 'readRange',
      key: 'readRange',
      render: (range: number) => range ? `${range} м` : '-'
    },
    {
      title: 'Последнее считывание',
      dataIndex: 'lastReadTime',
      key: 'lastReadTime',
      render: (time: string) => new Date(time).toLocaleString('ru-RU')
    },
    {
      title: 'Статистика',
      key: 'stats',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          {record.readCount && <Text type="secondary">Считываний: {record.readCount}</Text>}
          {record.errorCount && <Text type="secondary">Ошибок: {record.errorCount}</Text>}
        </Space>
      )
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Tooltip title="Просмотр">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleAddNew = (type: string) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Датчики (IoT)</Title>
        <Paragraph type="secondary">
          Мониторинг и управление IoT-устройствами: GPS-трекеры, температурные сенсоры и RFID системы
        </Paragraph>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab="Обзор" key="overview">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card>
                <Statistic
                  title="GPS Трекеры"
                  value={mockGpsTrackers.length}
                  prefix={<GlobalOutlined />}
                  suffix="активных"
                />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">Отслеживание транспорта в реальном времени</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card>
                <Statistic
                  title="Температурные сенсоры"
                  value={mockTemperatureSensors.length}
                  prefix={<ChromeOutlined />}
                  suffix="активных"
                />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">Контроль температуры в грузовиках</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card>
                <Statistic
                  title="RFID Системы"
                  value={mockRfidSystems.length}
                  prefix={<BarcodeOutlined />}
                  suffix="активных"
                />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">Автоматическая идентификация грузов</Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <Card title="Температура в грузовиках" extra={<Button icon={<ReloadOutlined />} size="small" />}>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={temperatureChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="temp" stroke="#52c41a" name="Температура (°C)" />
                    <Line type="monotone" dataKey="humidity" stroke="#1890ff" name="Влажность (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="GPS Мониторинг" extra={<Button icon={<ReloadOutlined />} size="small" />}>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={gpsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="speed" stroke="#1890ff" fill="#1890ff" name="Скорость (км/ч)" />
                    <Area type="monotone" dataKey="battery" stroke="#52c41a" fill="#52c41a" name="Заряд (%)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="GPS Трекеры" key="gps">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddNew('gps')}>
                Добавить GPS трекер
              </Button>
              <Search placeholder="Поиск по ID или названию" style={{ width: 300 }} />
              <Select defaultValue="all" style={{ width: 120 }}>
                <Option value="all">Все статусы</Option>
                <Option value="active">Активные</Option>
                <Option value="inactive">Неактивные</Option>
                <Option value="maintenance">Обслуживание</Option>
                <Option value="error">Ошибка</Option>
              </Select>
            </Space>
          </div>
          <Table 
            columns={gpsColumns} 
            dataSource={mockGpsTrackers} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Температурные сенсоры" key="temperature">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddNew('temperature')}>
                Добавить сенсор
              </Button>
              <Search placeholder="Поиск по ID или названию" style={{ width: 300 }} />
              <Select defaultValue="all" style={{ width: 150 }}>
                <Option value="all">Все расположения</Option>
                <Option value="cargo_area">Грузовой отсек</Option>
                <Option value="engine">Двигатель</Option>
                <Option value="refrigerator">Рефрижератор</Option>
                <Option value="external">Внешний</Option>
              </Select>
              <Select defaultValue="all" style={{ width: 120 }}>
                <Option value="all">Все статусы</Option>
                <Option value="active">Активные</Option>
                <Option value="alert">Предупреждения</Option>
                <Option value="error">Ошибки</Option>
              </Select>
            </Space>
          </div>
          <Table 
            columns={temperatureColumns} 
            dataSource={mockTemperatureSensors} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="RFID Системы" key="rfid">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddNew('rfid')}>
                Добавить RFID систему
              </Button>
              <Search placeholder="Поиск по ID или названию" style={{ width: 300 }} />
              <Select defaultValue="all" style={{ width: 120 }}>
                <Option value="all">Все типы</Option>
                <Option value="reader">Ридеры</Option>
                <Option value="tag">Теги</Option>
                <Option value="gate">Ворота</Option>
                <Option value="antenna">Антенны</Option>
              </Select>
              <Select defaultValue="all" style={{ width: 120 }}>
                <Option value="all">Все статусы</Option>
                <Option value="active">Активные</Option>
                <Option value="inactive">Неактивные</Option>
                <Option value="maintenance">Обслуживание</Option>
                <Option value="error">Ошибка</Option>
              </Select>
            </Space>
          </div>
          <Table 
            columns={rfidColumns} 
            dataSource={mockRfidSystems} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Карта" key="map">
          <Card>
            <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Space direction="vertical" align="center">
                <GlobalOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                <Title level={4}>Карта IoT устройств</Title>
                <Text type="secondary">Интерактивная карта с расположением всех IoT устройств</Text>
                <Button type="primary" icon={<EyeOutlined />}>
                  Открыть карту
                </Button>
              </Space>
            </div>
          </Card>
        </TabPane>

        <TabPane tab="Настройки" key="settings">
          <Card title="Настройки IoT системы">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card size="small" title="GPS Трекеры">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text>Интервал обновления по умолчанию:</Text>
                      <Select defaultValue="30" style={{ width: 100, marginLeft: 8 }}>
                        <Option value="10">10 сек</Option>
                        <Option value="30">30 сек</Option>
                        <Option value="60">1 мин</Option>
                        <Option value="300">5 мин</Option>
                      </Select>
                    </div>
                    <div>
                      <Text>Порог заряда батареи:</Text>
                      <Select defaultValue="20" style={{ width: 100, marginLeft: 8 }}>
                        <Option value="10">10%</Option>
                        <Option value="20">20%</Option>
                        <Option value="30">30%</Option>
                      </Select>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card size="small" title="Температурные сенсоры">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text>Интервал обновления по умолчанию:</Text>
                      <Select defaultValue="60" style={{ width: 100, marginLeft: 8 }}>
                        <Option value="30">30 сек</Option>
                        <Option value="60">1 мин</Option>
                        <Option value="300">5 мин</Option>
                        <Option value="600">10 мин</Option>
                      </Select>
                    </div>
                    <div>
                      <Text>Порог отклонения температуры:</Text>
                      <Select defaultValue="2" style={{ width: 100, marginLeft: 8 }}>
                        <Option value="1">±1°C</Option>
                        <Option value="2">±2°C</Option>
                        <Option value="5">±5°C</Option>
                      </Select>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
            <Divider />
            <Space>
              <Button type="primary" icon={<SettingOutlined />}>
                Сохранить настройки
              </Button>
              <Button icon={<ReloadOutlined />}>
                Сбросить к умолчаниям
              </Button>
            </Space>
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={`Добавить ${modalType === 'gps' ? 'GPS трекер' : modalType === 'temperature' ? 'температурный сенсор' : 'RFID систему'}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Отмена
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('Устройство добавлено успешно');
            setIsModalVisible(false);
          }}>
            Добавить
          </Button>
        ]}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Название" name="name" rules={[{ required: true }]}>
            <Input placeholder="Введите название устройства" />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea placeholder="Описание устройства" />
          </Form.Item>
          <Form.Item label="Модель" name="model" rules={[{ required: true }]}>
            <Input placeholder="Модель устройства" />
          </Form.Item>
          <Form.Item label="Производитель" name="manufacturer" rules={[{ required: true }]}>
            <Input placeholder="Производитель" />
          </Form.Item>
          {modalType === 'gps' && (
            <>
              <Form.Item label="IMEI" name="imei">
                <Input placeholder="IMEI номер" />
              </Form.Item>
              <Form.Item label="Номер SIM карты" name="simCardNumber">
                <Input placeholder="Номер SIM карты" />
              </Form.Item>
            </>
          )}
          {modalType === 'temperature' && (
            <>
              <Form.Item label="Расположение" name="location" rules={[{ required: true }]}>
                <Select placeholder="Выберите расположение">
                  <Option value="cargo_area">Грузовой отсек</Option>
                  <Option value="engine">Двигатель</Option>
                  <Option value="refrigerator">Рефрижератор</Option>
                  <Option value="external">Внешний</Option>
                  <Option value="driver_cabin">Кабина водителя</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Целевая температура" name="targetTemperature">
                <Input placeholder="Целевая температура в °C" />
              </Form.Item>
            </>
          )}
          {modalType === 'rfid' && (
            <>
              <Form.Item label="Тип" name="type" rules={[{ required: true }]}>
                <Select placeholder="Выберите тип">
                  <Option value="reader">Ридер</Option>
                  <Option value="tag">Тег</Option>
                  <Option value="gate">Ворота</Option>
                  <Option value="antenna">Антенна</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Частота (МГц)" name="frequency">
                <Input placeholder="Частота в МГц" />
              </Form.Item>
              <Form.Item label="Дальность считывания (м)" name="readRange">
                <Input placeholder="Дальность в метрах" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </AdminLayout>
  );
}


