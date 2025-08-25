import React, { useState } from 'react';
import type { Dayjs } from 'dayjs';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Space, DatePicker, Select, Button, Typography } from 'antd';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid, Legend
} from 'recharts';
import { 
  RiseOutlined, 
  ClockCircleOutlined, 
  CarOutlined, 
  HomeOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface KpiData {
  key: string;
  id: string;
  name: string;
  description: string;
  type: 'delivery_speed' | 'return_rate' | 'vehicle_utilization' | 'inventory_turnover' | 'order_accuracy' | 'cost_per_order';
  value: number;
  unit: string;
  target: number;
  minThreshold: number;
  maxThreshold: number;
  performance: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  measurementDate: string;
  period: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

const mockKpiData: KpiData[] = [
  {
    key: '1',
    id: '1',
    name: 'Скорость доставки',
    description: 'Среднее время от заказа до доставки',
    type: 'delivery_speed',
    value: 2.5,
    unit: 'дня',
    target: 2.0,
    minThreshold: 1.5,
    maxThreshold: 3.0,
    performance: 'good',
    measurementDate: '2024-01-15',
    period: 'месяц',
    trend: 'up',
    trendValue: 0.3,
  },
  {
    key: '2',
    id: '2',
    name: 'Процент возвратов',
    description: 'Доля возвращенных заказов',
    type: 'return_rate',
    value: 3.2,
    unit: '%',
    target: 2.0,
    minThreshold: 1.0,
    maxThreshold: 5.0,
    performance: 'average',
    measurementDate: '2024-01-15',
    period: 'месяц',
    trend: 'down',
    trendValue: 0.5,
  },
  {
    key: '3',
    id: '3',
    name: 'Загрузка транспорта',
    description: 'Средняя загрузка транспортных средств',
    type: 'vehicle_utilization',
    value: 78.5,
    unit: '%',
    target: 85.0,
    minThreshold: 70.0,
    maxThreshold: 95.0,
    performance: 'good',
    measurementDate: '2024-01-15',
    period: 'месяц',
    trend: 'up',
    trendValue: 2.1,
  },
  {
    key: '4',
    id: '4',
    name: 'Оборачиваемость запасов',
    description: 'Количество оборотов запасов в год',
    type: 'inventory_turnover',
    value: 12.5,
    unit: 'оборотов',
    target: 15.0,
    minThreshold: 10.0,
    maxThreshold: 20.0,
    performance: 'average',
    measurementDate: '2024-01-15',
    period: 'месяц',
    trend: 'up',
    trendValue: 0.8,
  },
  {
    key: '5',
    id: '5',
    name: 'Точность заказов',
    description: 'Процент заказов без ошибок',
    type: 'order_accuracy',
    value: 96.8,
    unit: '%',
    target: 98.0,
    minThreshold: 95.0,
    maxThreshold: 100.0,
    performance: 'good',
    measurementDate: '2024-01-15',
    period: 'месяц',
    trend: 'up',
    trendValue: 0.5,
  },
  {
    key: '6',
    id: '6',
    name: 'Стоимость заказа',
    description: 'Средняя стоимость обработки заказа',
    type: 'cost_per_order',
    value: 1250,
    unit: '₽',
    target: 1000,
    minThreshold: 800,
    maxThreshold: 1500,
    performance: 'average',
    measurementDate: '2024-01-15',
    period: 'месяц',
    trend: 'down',
    trendValue: 50,
  },
];

const performanceColors = {
  excellent: '#52c41a',
  good: '#73d13d',
  average: '#faad14',
  poor: '#ff7a45',
  critical: '#ff4d4f',
};

const performanceLabels = {
  excellent: 'Отлично',
  good: 'Хорошо',
  average: 'Средне',
  poor: 'Плохо',
  critical: 'Критично',
};

const trendColors = {
  up: '#52c41a',
  down: '#ff4d4f',
  stable: '#1890ff',
};

const trendIcons = {
  up: <RiseOutlined style={{ color: '#52c41a' }} />,
  down: <RiseOutlined style={{ color: '#ff4d4f', transform: 'rotate(180deg)' }} />,
  stable: <RiseOutlined style={{ color: '#1890ff' }} />,
};

// Данные для графиков
const deliveryData = [
  { month: 'Янв', planned: 2.0, actual: 2.1, target: 2.0 },
  { month: 'Фев', planned: 2.0, actual: 1.9, target: 2.0 },
  { month: 'Мар', planned: 2.0, actual: 2.3, target: 2.0 },
  { month: 'Апр', planned: 2.0, actual: 2.0, target: 2.0 },
  { month: 'Май', planned: 2.0, actual: 1.8, target: 2.0 },
  { month: 'Июн', planned: 2.0, actual: 2.5, target: 2.0 },
];

const costData = [
  { month: 'Янв', transport: 45000, warehouse: 32000, admin: 18000 },
  { month: 'Фев', transport: 42000, warehouse: 31000, admin: 17500 },
  { month: 'Мар', transport: 48000, warehouse: 33000, admin: 18200 },
  { month: 'Апр', transport: 41000, warehouse: 30500, admin: 17000 },
  { month: 'Май', transport: 46000, warehouse: 32500, admin: 17800 },
  { month: 'Июн', transport: 50000, warehouse: 34000, admin: 18500 },
];

const utilizationData = [
  { warehouse: 'РЦ Москва', utilization: 85, capacity: 50000 },
  { warehouse: 'РЦ СПб', utilization: 72, capacity: 45000 },
  { warehouse: 'РЦ Казань', utilization: 68, capacity: 30000 },
  { warehouse: 'РЦ Екатеринбург', utilization: 78, capacity: 35000 },
  { warehouse: 'РЦ Новосибирск', utilization: 65, capacity: 25000 },
];

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const getPerformanceColor = (performance: string) => {
    return performanceColors[performance as keyof typeof performanceColors] || '#666';
  };

  const getPerformanceStatus = (value: number, target: number, min: number, max: number) => {
    if (value <= min) return 'exception';
    if (value >= max) return 'exception';
    if (Math.abs(value - target) <= (max - min) * 0.1) return 'success';
    if (Math.abs(value - target) <= (max - min) * 0.3) return 'normal';
    return 'active';
  };

  const columns: ColumnsType<KpiData> = [
    {
      title: 'KPI',
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
      title: 'Значение',
      key: 'value',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {record.value} {record.unit}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Цель: {record.target} {record.unit}
          </div>
        </div>
      ),
    },
    {
      title: 'Производительность',
      key: 'performance',
      render: (_, record) => {
        const status = getPerformanceStatus(record.value, record.target, record.minThreshold, record.maxThreshold);
        const targetProgress = Math.round((record.value / record.target) * 100);
        
        return (
          <div>
            <Tag color={getPerformanceColor(record.performance)}>
              {performanceLabels[record.performance]}
            </Tag>
            <div style={{ marginTop: 4 }}>
              <Progress
                percent={Math.min(targetProgress, 100)}
                size="small"
                status={status}
                format={(percent) => `${percent}% от цели`}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: 'Тренд',
      key: 'trend',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {trendIcons[record.trend]}
            <span style={{ color: trendColors[record.trend] }}>
              {record.trendValue} {record.unit}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.period}
          </div>
        </div>
      ),
    },
    {
      title: 'Пороги',
      key: 'thresholds',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Мин: {record.minThreshold} {record.unit}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Макс: {record.maxThreshold} {record.unit}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3}>Аналитика и KPI показатели</Title>
          </Col>
          <Col>
            <Space>
              <Select
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                style={{ width: 120 }}
              >
                <Option value="week">Неделя</Option>
                <Option value="month">Месяц</Option>
                <Option value="quarter">Квартал</Option>
                <Option value="year">Год</Option>
              </Select>
              <RangePicker
                value={selectedDateRange}
                onChange={(dates: [Dayjs | null, Dayjs | null] | null) => setSelectedDateRange(dates)}
                placeholder={['Начало периода', 'Конец периода']}
              />
              <Button type="primary">Обновить</Button>
            </Space>
          </Col>
        </Row>

        {/* KPI Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Скорость доставки"
                value={2.5}
                suffix="дня"
                valueStyle={{ color: '#52c41a' }}
                prefix={<ClockCircleOutlined />}
              />
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={75}
                  size="small"
                  status="active"
                  format={(percent) => `${percent}% от цели`}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Загрузка транспорта"
                value={78.5}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
                prefix={<CarOutlined />}
              />
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={78.5}
                  size="small"
                  status="active"
                  format={(percent) => `${percent}%`}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Загрузка складов"
                value={72.3}
                suffix="%"
                valueStyle={{ color: '#faad14' }}
                prefix={<HomeOutlined />}
              />
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={72.3}
                  size="small"
                  status="active"
                  format={(percent) => `${percent}%`}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Стоимость заказа"
                value={1250}
                suffix="₽"
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<DollarOutlined />}
              />
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={83}
                  size="small"
                  status="exception"
                  format={(percent) => `${percent}% от цели`}
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Charts Row 1 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="Динамика скорости доставки" style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    stroke="#1890ff"
                    strokeWidth={2}
                    name="План"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#52c41a"
                    strokeWidth={2}
                    name="Факт"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#ff4d4f"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Цель"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Структура затрат по месяцам" style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="transport"
                    stackId="1"
                    stroke="#1890ff"
                    fill="#1890ff"
                    name="Транспорт"
                  />
                  <Area
                    type="monotone"
                    dataKey="warehouse"
                    stackId="1"
                    stroke="#52c41a"
                    fill="#52c41a"
                    name="Склад"
                  />
                  <Area
                    type="monotone"
                    dataKey="admin"
                    stackId="1"
                    stroke="#faad14"
                    fill="#faad14"
                    name="Администрирование"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Charts Row 2 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="Загрузка складов" style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={utilizationData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="warehouse" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="utilization" fill="#1890ff" name="Загрузка (%)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Распределение KPI по статусам" style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Отлично', value: 2, color: '#52c41a' },
                      { name: 'Хорошо', value: 3, color: '#73d13d' },
                      { name: 'Средне', value: 1, color: '#faad14' },
                      { name: 'Плохо', value: 0, color: '#ff7a45' },
                      { name: 'Критично', value: 0, color: '#ff4d4f' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Отлично', value: 2, color: '#52c41a' },
                      { name: 'Хорошо', value: 3, color: '#73d13d' },
                      { name: 'Средне', value: 1, color: '#faad14' },
                      { name: 'Плохо', value: 0, color: '#ff7a45' },
                      { name: 'Критично', value: 0, color: '#ff4d4f' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* KPI Table */}
        <Card title="Детальные KPI показатели">
          <Table
            columns={columns}
            dataSource={mockKpiData}
            pagination={false}
            scroll={{ x: 1000 }}
          />
        </Card>
      </Card>
    </div>
  );
}
