import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, DatePicker, Tag, message, Card, Row, Col, Progress, Badge, Tabs, Alert, Statistic, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, CloudOutlined, DatabaseOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const { Search } = Input;
const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface SensorData {
  key: string;
  id: string;
  sensorId: string;
  name: string;
  description: string;
  type: 'temperature' | 'humidity' | 'door' | 'motion' | 'light' | 'pressure' | 'vibration';
  model: string;
  manufacturer: string;
  serialNumber: string;
  firmwareVersion: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  minThreshold: number;
  maxThreshold: number;
  readingInterval: number;
  lastReadingTime: string;
  lastReadingValue: number;
  unit: string;
  location: string;
  warehouseId: string;
  notes: string;
}

interface ReadingData {
  key: string;
  id: string;
  sensorId: string;
  value: number;
  unit: string;
  timestamp: string;
  quality: 'good' | 'bad' | 'uncertain';
  isAlert: boolean;
  alertMessage: string;
  metadata: string;
}

const mockSensors: SensorData[] = [
  {
    key: '1',
    id: '1',
    sensorId: 'SNS-001',
    name: 'Датчик температуры холодильника',
    description: 'Контроль температуры в холодильной камере',
    type: 'temperature',
    model: 'TEMP-2000',
    manufacturer: 'SensorTech',
    serialNumber: 'SN00123456',
    firmwareVersion: 'v2.1.0',
    status: 'active',
    minThreshold: 2,
    maxThreshold: 8,
    readingInterval: 60,
    lastReadingTime: '2024-01-15 15:30:00',
    lastReadingValue: 4.2,
    unit: '°C',
    location: 'Холодильная камера A',
    warehouseId: 'WH-001',
    notes: 'Критически важный датчик',
  },
  {
    key: '2',
    id: '2',
    sensorId: 'SNS-002',
    name: 'Датчик влажности склада',
    description: 'Контроль влажности в основном складе',
    type: 'humidity',
    model: 'HUM-1500',
    manufacturer: 'SensorTech',
    serialNumber: 'SN00123457',
    firmwareVersion: 'v1.8.2',
    status: 'active',
    minThreshold: 40,
    maxThreshold: 60,
    readingInterval: 120,
    lastReadingTime: '2024-01-15 15:28:00',
    lastReadingValue: 52.3,
    unit: '%',
    location: 'Основной склад',
    warehouseId: 'WH-001',
    notes: 'Стандартный мониторинг',
  },
  {
    key: '3',
    id: '3',
    sensorId: 'SNS-003',
    name: 'Датчик движения входа',
    description: 'Контроль движения у главного входа',
    type: 'motion',
    model: 'MOT-3000',
    manufacturer: 'SecurityTech',
    serialNumber: 'SN00123458',
    firmwareVersion: 'v3.0.1',
    status: 'active',
    minThreshold: 0,
    maxThreshold: 1,
    readingInterval: 30,
    lastReadingTime: '2024-01-15 15:29:00',
    lastReadingValue: 1,
    unit: 'движение',
    location: 'Главный вход',
    warehouseId: 'WH-001',
    notes: 'Система безопасности',
  },
  {
    key: '4',
    id: '4',
    sensorId: 'SNS-004',
    name: 'Датчик давления в системе',
    description: 'Контроль давления в пневматической системе',
    type: 'pressure',
    model: 'PRES-2500',
    manufacturer: 'IndustrialTech',
    serialNumber: 'SN00123459',
    firmwareVersion: 'v2.5.0',
    status: 'maintenance',
    minThreshold: 5,
    maxThreshold: 8,
    readingInterval: 300,
    lastReadingTime: '2024-01-15 14:30:00',
    lastReadingValue: 6.8,
    unit: 'бар',
    location: 'Техническое помещение',
    warehouseId: 'WH-001',
    notes: 'Требует обслуживания',
  },
];

const mockReadings: ReadingData[] = [
  {
    key: '1',
    id: '1',
    sensorId: 'SNS-001',
    value: 4.2,
    unit: '°C',
    timestamp: '2024-01-15 15:30:00',
    quality: 'good',
    isAlert: false,
    alertMessage: '',
    metadata: 'Температура в норме',
  },
  {
    key: '2',
    id: '2',
    sensorId: 'SNS-001',
    value: 4.5,
    unit: '°C',
    timestamp: '2024-01-15 15:29:00',
    quality: 'good',
    isAlert: false,
    alertMessage: '',
    metadata: 'Температура в норме',
  },
  {
    key: '3',
    id: '3',
    sensorId: 'SNS-001',
    value: 4.8,
    unit: '°C',
    timestamp: '2024-01-15 15:28:00',
    quality: 'good',
    isAlert: false,
    alertMessage: '',
    metadata: 'Температура в норме',
  },
  {
    key: '4',
    id: '4',
    sensorId: 'SNS-002',
    value: 52.3,
    unit: '%',
    timestamp: '2024-01-15 15:28:00',
    quality: 'good',
    isAlert: false,
    alertMessage: '',
    metadata: 'Влажность в норме',
  },
  {
    key: '5',
    id: '5',
    sensorId: 'SNS-003',
    value: 1,
    unit: 'движение',
    timestamp: '2024-01-15 15:29:00',
    quality: 'good',
    isAlert: false,
    alertMessage: '',
    metadata: 'Обнаружено движение',
  },
];

const sensorTypeColors = {
  temperature: 'red',
  humidity: 'blue',
  door: 'green',
  motion: 'orange',
  light: 'yellow',
  pressure: 'purple',
  vibration: 'brown',
};

const sensorTypeLabels = {
  temperature: 'Температура',
  humidity: 'Влажность',
  door: 'Дверь',
  motion: 'Движение',
  light: 'Освещение',
  pressure: 'Давление',
  vibration: 'Вибрация',
};

const statusColors = {
  active: 'green',
  inactive: 'orange',
  maintenance: 'blue',
  error: 'red',
};

const statusLabels = {
  active: 'Активен',
  inactive: 'Неактивен',
  maintenance: 'Обслуживание',
  error: 'Ошибка',
};

const qualityColors = {
  good: 'green',
  bad: 'red',
  uncertain: 'orange',
};

const qualityLabels = {
  good: 'Хорошее',
  bad: 'Плохое',
  uncertain: 'Неопределенное',
};

// Данные для графиков
const temperatureData = [
  { time: '15:25', value: 4.0 },
  { time: '15:26', value: 4.1 },
  { time: '15:27', value: 4.3 },
  { time: '15:28', value: 4.8 },
  { time: '15:29', value: 4.5 },
  { time: '15:30', value: 4.2 },
];

const humidityData = [
  { time: '15:20', value: 51.5 },
  { time: '15:22', value: 51.8 },
  { time: '15:24', value: 52.0 },
  { time: '15:26', value: 52.1 },
  { time: '15:28', value: 52.3 },
];

export default function IotMonitoring() {
  const [activeTab, setActiveTab] = useState('sensors');

  return (
    <div>
      <Card>
        <h2>IoT мониторинг и управление датчиками</h2>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Датчики" key="sensors">
            <SensorManagement />
          </TabPane>
          <TabPane tab="Показания" key="readings">
            <ReadingManagement />
          </TabPane>
          <TabPane tab="Мониторинг" key="monitoring">
            <MonitoringDashboard />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

function SensorManagement() {
  const [data, setData] = useState<SensorData[]>(mockSensors);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSensor, setEditingSensor] = useState<SensorData | null>(null);
  const [form] = Form.useForm();

  const getSensorStatus = (sensor: SensorData) => {
    if (sensor.status === 'error') return 'exception';
    if (sensor.status === 'maintenance') return 'warning';
    if (sensor.status === 'active') return 'success';
    return 'normal';
  };

  const getThresholdStatus = (sensor: SensorData) => {
    if (sensor.lastReadingValue <= sensor.minThreshold || sensor.lastReadingValue >= sensor.maxThreshold) {
      return 'error';
    }
    if (sensor.lastReadingValue >= sensor.maxThreshold * 0.9 || sensor.lastReadingValue <= sensor.minThreshold * 1.1) {
      return 'warning';
    }
    return 'success';
  };

  const columns: ColumnsType<SensorData> = [
    {
      title: 'ID датчика',
      dataIndex: 'sensorId',
      key: 'sensorId',
      sorter: (a, b) => a.sensorId.localeCompare(b.sensorId),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={sensorTypeColors[type as keyof typeof sensorTypeColors]}>
          {sensorTypeLabels[type as keyof typeof sensorTypeLabels]}
        </Tag>
      ),
      filters: Object.entries(sensorTypeLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {statusLabels[status as keyof typeof statusLabels]}
        </Tag>
      ),
      filters: Object.entries(statusLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Последнее показание',
      key: 'reading',
      render: (_, record) => {
        const thresholdStatus = getThresholdStatus(record);
        return (
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {record.lastReadingValue} {record.unit}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
              {record.lastReadingTime}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
              Пороги: {record.minThreshold} - {record.maxThreshold} {record.unit}
            </div>
            <Badge
              status={thresholdStatus}
              text={thresholdStatus === 'error' ? 'Выход за пределы' : 
                    thresholdStatus === 'warning' ? 'Приближение к пределам' : 'В норме'}
            />
          </div>
        );
      },
    },
    {
      title: 'Техническая информация',
      key: 'tech',
      render: (_, record) => (
        <div>
          <div>Модель: {record.model}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Производитель: {record.manufacturer}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            SN: {record.serialNumber}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            FW: {record.firmwareVersion}
          </div>
        </div>
      ),
    },
    {
      title: 'Расположение',
      key: 'location',
      render: (_, record) => (
        <div>
          <div>{record.location}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Склад: {record.warehouseId}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Интервал: {record.readingInterval} сек
          </div>
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
    setEditingSensor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (sensor: SensorData) => {
    setEditingSensor(sensor);
    form.setFieldsValue(sensor);
    setIsModalVisible(true);
  };

  const handleDelete = (sensor: SensorData) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: `Вы уверены, что хотите удалить датчик "${sensor.name}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        setData(data.filter(item => item.key !== sensor.key));
        message.success('Датчик успешно удален');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSensor) {
        setData(data.map(item =>
          item.key === editingSensor.key ? { ...item, ...values } : item
        ));
        message.success('Датчик успешно обновлен');
      } else {
        const newSensor: SensorData = {
          key: Date.now().toString(),
          id: Date.now().toString(),
          sensorId: `SNS-${String(data.length + 1).padStart(3, '0')}`,
          ...values,
        };
        setData([...data, newSensor]);
        message.success('Датчик успешно создан');
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
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h3>Управление датчиками</h3>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Добавить датчик
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
            `${range[0]}-${range[1]} из ${total} датчиков`,
        }}
        scroll={{ x: 1400 }}
      />

      <Modal
        title={editingSensor ? 'Редактировать датчик' : 'Добавить датчик'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingSensor ? 'Обновить' : 'Создать'}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            readingInterval: 60,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Название датчика"
                rules={[{ required: true, message: 'Введите название' }]}
              >
                <Input placeholder="Введите название" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Тип датчика"
                rules={[{ required: true, message: 'Выберите тип' }]}
              >
                <Select placeholder="Выберите тип">
                  {Object.entries(sensorTypeLabels).map(([value, label]) => (
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
                <TextArea rows={2} placeholder="Введите описание датчика" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="model"
                label="Модель"
                rules={[{ required: true, message: 'Введите модель' }]}
              >
                <Input placeholder="Введите модель" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="manufacturer"
                label="Производитель"
                rules={[{ required: true, message: 'Введите производителя' }]}
              >
                <Input placeholder="Введите производителя" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="serialNumber"
                label="Серийный номер"
                rules={[{ required: true, message: 'Введите серийный номер' }]}
              >
                <Input placeholder="Введите серийный номер" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="minThreshold"
                label="Минимальный порог"
                rules={[{ required: true, message: 'Введите минимальный порог' }]}
              >
                <Input type="number" step="0.1" placeholder="Введите порог" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxThreshold"
                label="Максимальный порог"
                rules={[{ required: true, message: 'Введите максимальный порог' }]}
              >
                <Input type="number" step="0.1" placeholder="Введите порог" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit"
                label="Единица измерения"
                rules={[{ required: true, message: 'Введите единицу' }]}
              >
                <Input placeholder="Например: °C, %, бар" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="readingInterval"
                label="Интервал чтения (сек)"
                rules={[{ required: true, message: 'Введите интервал' }]}
              >
                <Input type="number" placeholder="Введите интервал" />
              </Form.Item>
            </Col>
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                name="warehouseId"
                label="ID склада"
                rules={[{ required: true, message: 'Введите ID склада' }]}
              >
                <Input placeholder="Введите ID склада" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Местоположение"
                rules={[{ required: true, message: 'Введите местоположение' }]}
              >
                <Input placeholder="Введите местоположение" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="firmwareVersion"
                label="Версия прошивки"
              >
                <Input placeholder="Введите версию" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="notes"
                label="Примечания"
              >
                <TextArea rows={2} placeholder="Введите примечания" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

function ReadingManagement() {
  const [data, setData] = useState<ReadingData[]>(mockReadings);

  const columns: ColumnsType<ReadingData> = [
    {
      title: 'ID датчика',
      dataIndex: 'sensorId',
      key: 'sensorId',
      sorter: (a, b) => a.sensorId.localeCompare(b.sensorId),
    },
    {
      title: 'Значение',
      key: 'value',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {record.value} {record.unit}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.timestamp}
          </div>
        </div>
      ),
    },
    {
      title: 'Качество',
      dataIndex: 'quality',
      key: 'quality',
      render: (quality: string) => (
        <Tag color={qualityColors[quality as keyof typeof qualityColors]}>
          {qualityLabels[quality as keyof typeof qualityLabels]}
        </Tag>
      ),
      filters: Object.entries(qualityLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.quality === value,
    },
    {
      title: 'Алерт',
      dataIndex: 'isAlert',
      key: 'isAlert',
      render: (isAlert: boolean) => (
        <Tag color={isAlert ? 'red' : 'green'}>
          {isAlert ? 'Да' : 'Нет'}
        </Tag>
      ),
    },
    {
      title: 'Сообщение',
      dataIndex: 'alertMessage',
      key: 'alertMessage',
      render: (text) => (
        <div>
          {text || 'Нет сообщений'}
        </div>
      ),
    },
    {
      title: 'Метаданные',
      dataIndex: 'metadata',
      key: 'metadata',
      render: (text) => (
        <div>
          {text || 'Нет данных'}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h3>Показания датчиков</h3>
        </Col>
        <Col>
          <Text style={{ color: '#666' }}>
            Последние показания всех активных датчиков
          </Text>
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
            `${range[0]}-${range[1]} из ${total} показаний`,
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}

function MonitoringDashboard() {
  const [data] = useState<SensorData[]>(mockSensors);

  const activeSensors = data.filter(sensor => sensor.status === 'active').length;
  const errorSensors = data.filter(sensor => sensor.status === 'error').length;
  const maintenanceSensors = data.filter(sensor => sensor.status === 'maintenance').length;

  return (
    <div>
      <h3>Панель мониторинга</h3>

      {/* Статистика */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего датчиков"
              value={data.length}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Активных"
              value={activeSensors}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ошибок"
              value={errorSensors}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="На обслуживании"
              value={maintenanceSensors}
              prefix={<CloudOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Алерты */}
      {errorSensors > 0 && (
        <Alert
          message="Внимание! Обнаружены датчики с ошибками"
          description={`${errorSensors} датчик(ов) требует немедленного внимания`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {maintenanceSensors > 0 && (
        <Alert
          message="Требуется обслуживание"
          description={`${maintenanceSensors} датчик(ов) находится на обслуживании`}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Графики */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Температура холодильника" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ff4d4f"
                  strokeWidth={2}
                  name="Температура (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Влажность склада" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={humidityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1890ff"
                  strokeWidth={2}
                  name="Влажность (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Статус датчиков */}
      <Card title="Статус датчиков по типам">
        <Row gutter={[16, 16]}>
          {Object.entries(sensorTypeLabels).map(([type, label]) => {
            const typeSensors = data.filter(sensor => sensor.type === type);
            const activeTypeSensors = typeSensors.filter(sensor => sensor.status === 'active').length;
            const totalTypeSensors = typeSensors.length;
            
            if (totalTypeSensors === 0) return null;

            return (
              <Col xs={24} sm={12} lg={8} key={type}>
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{label}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {activeTypeSensors} / {totalTypeSensors} активны
                      </div>
                    </div>
                    <Progress
                      type="circle"
                      percent={Math.round((activeTypeSensors / totalTypeSensors) * 100)}
                      size={60}
                      status={activeTypeSensors === totalTypeSensors ? 'success' : 
                              activeTypeSensors === 0 ? 'exception' : 'normal'}
                    />
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>
    </div>
  );
}
