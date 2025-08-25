import React, { useMemo, useState } from 'react';
import AdminLayout from './../components/AdminLayout';
import StatisticsCards from './../components/StatisticsCards';
import { Typography, Row, Col, Card, Button, theme as antdTheme } from 'antd';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { 
  FileTextOutlined, GroupOutlined, SearchOutlined
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const data = [
  { name: 'Пн', заказы: 12 },
  { name: 'Вт', заказы: 18 },
  { name: 'Ср', заказы: 10 },
  { name: 'Чт', заказы: 22 },
  { name: 'Пт', заказы: 15 },
  { name: 'Сб', заказы: 8 },
  { name: 'Вс', заказы: 5 },
];

const pieData = [
  { name: 'Доставлено', value: 85, color: '#52c41a' },
  { name: 'В пути', value: 45, color: '#1890ff' },
  { name: 'Ожидает', value: 23, color: '#faad14' },
  { name: 'Отменено', value: 3, color: '#ff4d4f' },
];

export default function Dashboard() {
  const { token } = antdTheme.useToken();
  const chartColors = useMemo(() => ({
    primary: token.colorPrimary,
    grid: token.colorSplit,
    axis: token.colorTextSecondary,
    tooltipBg: token.colorBgElevated,
    tooltipBorder: token.colorBorder,
    text: token.colorText,
    textSecondary: token.colorTextSecondary,
  }), [token]);

  return (
    <AdminLayout>
      <Title level={3}>Dashboard</Title>
      
      {/* Statistics Cards in a section wrapper */}
      <div className="card-section">
        <StatisticsCards />
      </div>
      
      {/* Модули управления заказами */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }} className="card-section">
        <Col xs={24} lg={8}>
          <Card 
            title="Управление заказами" 
            extra={<FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
            style={{ height: 200 }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={4}>Заказы</Title>
              <Text type="secondary">
                Создание, редактирование и управление заказами
              </Text>
            </div>
            <Link href="/orders" passHref>
              <Button type="primary" block>
                Открыть модуль
              </Button>
            </Link>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Логистические партии" 
            extra={<GroupOutlined style={{ fontSize: '20px', color: '#52c41a' }} />}
            style={{ height: 200 }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <GroupOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={4}>Партии</Title>
              <Text type="secondary">
                Группировка заказов в логистические партии
              </Text>
            </div>
            <Link href="/logistics-batches" passHref>
              <Button type="primary" block>
                Открыть модуль
              </Button>
            </Link>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Отслеживание заказов" 
            extra={<SearchOutlined style={{ fontSize: '20px', color: '#faad14' }} />}
            style={{ height: 200 }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <SearchOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }} />
              <Title level={4}>Отслеживание</Title>
              <Text type="secondary">
                Отслеживание статуса заказов в реальном времени
              </Text>
            </div>
            <Link href="/order-tracking" passHref>
              <Button type="primary" block>
                Открыть модуль
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Orders Chart */}
        <Col xs={24} lg={12}>
          <Card title="Заказы по дням недели" bodyStyle={{ paddingBottom: 8 }} className="card--subtle">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ordersGradientRoot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="name" tick={{ fill: chartColors.axis }} axisLine={{ stroke: chartColors.grid }} tickLine={{ stroke: chartColors.grid }} />
                <YAxis tick={{ fill: chartColors.axis }} axisLine={{ stroke: chartColors.grid }} tickLine={{ stroke: chartColors.grid }} />
                <Tooltip
                  cursor={{ stroke: chartColors.primary, strokeWidth: 1 }}
                  contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.text }}
                  labelStyle={{ color: chartColors.textSecondary }}
                  itemStyle={{ color: chartColors.text }}
                />
                <Area type="monotone" dataKey="заказы" stroke={chartColors.primary} fill="url(#ordersGradientRoot)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Status Distribution (Donut) */}
        <Col xs={24} lg={12}>
          <Card title="Распределение статусов заказов" bodyStyle={{ paddingBottom: 8 }} className="card--subtle">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <defs>
                  {pieData.map((entry, index) => (
                    <linearGradient key={`grad-root-${index}`} id={`grad-root-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.3} />
                    </linearGradient>
                  ))}
                </defs>
                <PieWithHoverRoot data={pieData} textColor={chartColors.text} />
                <Legend verticalAlign="bottom" height={24} formatter={(value: string) => (
                  <span style={{ color: chartColors.text }}>{value}</span>
                )} />
                <Tooltip
                  formatter={(value: number, name: string) => [`${value}`, name]}
                  contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.text }}
                  itemStyle={{ color: chartColors.text }}
                  labelStyle={{ color: chartColors.textSecondary }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}

function PieWithHoverRoot({ data, textColor }: { data: Array<{ name: string; value: number; color: string }>; textColor?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={55}
      outerRadius={90}
      paddingAngle={2}
      dataKey="value"
      onMouseEnter={(_, i) => setActiveIndex(i)}
      onMouseLeave={() => setActiveIndex(null)}
      label={({ name, percent }) => (
        <tspan fill={textColor || '#666'}>{`${name} ${(percent * 100).toFixed(0)}%`}</tspan>
      )}
      labelLine={false}
    >
      {data.map((entry, index) => (
        <Cell
          key={`cell-root-${index}`}
          fill={`url(#grad-root-${index})`}
          stroke={entry.color}
          strokeWidth={activeIndex === index ? 2 : 1}
          opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
        />
      ))}
    </Pie>
  );
}

