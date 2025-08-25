import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Steps, Tag, Typography, Input, Button, 
  Timeline, Badge, Alert, Space, Divider, Progress, Statistic
} from 'antd';
import { 
  SearchOutlined, TruckOutlined, CheckCircleOutlined, 
  ClockCircleOutlined, ExclamationCircleOutlined, 
  FileTextOutlined, EnvironmentOutlined, PhoneOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface TrackingEvent {
  id: string;
  timestamp: string;
  status: string;
  description: string;
  location?: string;
  operator?: string;
  notes?: string;
}

interface OrderTrackingData {
  orderNumber: string;
  customerName: string;
  status: 'draft' | 'confirmed' | 'processing' | 'picking' | 'packed' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';
  currentStep: number;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingNumber: string;
  vehicleId?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  sourceLocation: string;
  destination: string;
  progress: number;
  events: TrackingEvent[];
  lastUpdate: string;
}

const mockTrackingData: OrderTrackingData = {
  orderNumber: 'ORD-2024-001',
  customerName: 'Гипермаркет "МегаМолл"',
  status: 'in_transit',
  currentStep: 6,
  estimatedDelivery: '2024-01-17T18:00:00Z',
  trackingNumber: 'TRK-001234',
  vehicleId: 'VEH-001',
  driverId: 'DRV-001',
  driverName: 'Иванов Петр Сергеевич',
  driverPhone: '+7 (999) 123-45-67',
  sourceLocation: 'РЦ "Москва-Центральный"',
  destination: 'Москва, ул. Тверская, 1',
  progress: 75,
  lastUpdate: '2024-01-15T14:30:00Z',
  events: [
    {
      id: '1',
      timestamp: '2024-01-15T08:00:00Z',
      status: 'confirmed',
      description: 'Заказ подтвержден',
      operator: 'Менеджер Иванова А.П.',
      location: 'РЦ "Москва-Центральный"'
    },
    {
      id: '2',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'processing',
      description: 'Заказ взят в обработку',
      operator: 'Оператор Петров В.С.',
      location: 'РЦ "Москва-Центральный"'
    },
    {
      id: '3',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'picking',
      description: 'Начата комплектация заказа',
      operator: 'Комплектовщик Сидоров А.И.',
      location: 'РЦ "Москва-Центральный"'
    },
    {
      id: '4',
      timestamp: '2024-01-15T12:00:00Z',
      status: 'packed',
      description: 'Заказ упакован и готов к отправке',
      operator: 'Упаковщик Козлов М.В.',
      location: 'РЦ "Москва-Центральный"'
    },
    {
      id: '5',
      timestamp: '2024-01-15T13:45:00Z',
      status: 'shipped',
      description: 'Заказ передан водителю',
      operator: 'Диспетчер Смирнова Е.К.',
      location: 'РЦ "Москва-Центральный"'
    },
    {
      id: '6',
      timestamp: '2024-01-15T14:30:00Z',
      status: 'in_transit',
      description: 'Заказ в пути',
      operator: 'Водитель Иванов П.С.',
      location: 'Москва, ул. Ленинградская, 45'
    }
  ]
};

const statusSteps = [
  { title: 'Подтвержден', description: 'Заказ подтвержден' },
  { title: 'Обработка', description: 'Заказ в обработке' },
  { title: 'Комплектация', description: 'Комплектация товаров' },
  { title: 'Упаковка', description: 'Упаковка заказа' },
  { title: 'Отправка', description: 'Передача водителю' },
  { title: 'В пути', description: 'Доставка' },
  { title: 'Доставлен', description: 'Заказ доставлен' }
];

const statusColors = {
  draft: 'default',
  confirmed: 'blue',
  processing: 'processing',
  picking: 'orange',
  packed: 'cyan',
  shipped: 'geekblue',
  in_transit: 'blue',
  delivered: 'success',
  cancelled: 'error',
  returned: 'warning'
};

export default function OrderTracking() {
  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Имитация поиска заказа
  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    
    setIsLoading(true);
    // Имитация API запроса
    setTimeout(() => {
      setTrackingData(mockTrackingData);
      setIsLoading(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Черновик',
      confirmed: 'Подтвержден',
      processing: 'Обрабатывается',
      picking: 'Комплектуется',
      packed: 'Упакован',
      shipped: 'Отправлен',
      in_transit: 'В пути',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
      returned: 'Возврат'
    };
    return labels[status] || status;
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Отслеживание заказов</Title>
      
      {/* Поиск заказа */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={16}>
            <Search
              placeholder="Введите номер заказа или трек-номер для отслеживания"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              loading={isLoading}
            />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Text type="secondary">
              Пример: ORD-2024-001 или TRK-001234
            </Text>
          </Col>
        </Row>
      </Card>

      {trackingData && (
        <>
          {/* Основная информация о заказе */}
          <Card style={{ marginBottom: 24 }}>
            <Row gutter={24}>
              <Col span={16}>
                <Title level={3}>Заказ {trackingData.orderNumber}</Title>
                <Paragraph>
                  <strong>Клиент:</strong> {trackingData.customerName}
                </Paragraph>
                <Paragraph>
                  <strong>Статус:</strong>{' '}
                  <Badge 
                    status={statusColors[trackingData.status] as any} 
                    text={getStatusLabel(trackingData.status)} 
                  />
                </Paragraph>
                <Paragraph>
                  <strong>Ожидаемая доставка:</strong> {formatDate(trackingData.estimatedDelivery)}
                </Paragraph>
                {trackingData.actualDelivery && (
                  <Paragraph>
                    <strong>Фактическая доставка:</strong> {formatDate(trackingData.actualDelivery)}
                  </Paragraph>
                )}
              </Col>
              <Col span={8}>
                <Statistic
                  title="Прогресс доставки"
                  value={trackingData.progress}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
                <Progress 
                  percent={trackingData.progress} 
                  status="active"
                  style={{ marginTop: 16 }}
                />
              </Col>
            </Row>
          </Card>

          {/* Прогресс доставки */}
          <Card style={{ marginBottom: 24 }}>
            <Title level={4}>Прогресс доставки</Title>
            <Steps 
              current={trackingData.currentStep} 
              progressDot
              size="small"
            >
              {statusSteps.map((step, index) => (
                <Step 
                  key={index}
                  title={step.title} 
                  description={step.description}
                  status={index < trackingData.currentStep ? 'finish' : index === trackingData.currentStep ? 'process' : 'wait'}
                />
              ))}
            </Steps>
          </Card>

          {/* Информация о доставке */}
          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col span={12}>
              <Card title="Информация о доставке">
                <Paragraph>
                  <EnvironmentOutlined /> <strong>Откуда:</strong> {trackingData.sourceLocation}
                </Paragraph>
                <Paragraph>
                  <EnvironmentOutlined /> <strong>Куда:</strong> {trackingData.destination}
                </Paragraph>
                {trackingData.vehicleId && (
                  <Paragraph>
                    <TruckOutlined /> <strong>Транспорт:</strong> {trackingData.vehicleId}
                  </Paragraph>
                )}
                {trackingData.driverName && (
                  <Paragraph>
                    <strong>Водитель:</strong> {trackingData.driverName}
                  </Paragraph>
                )}
                {trackingData.driverPhone && (
                  <Paragraph>
                    <PhoneOutlined /> <strong>Телефон:</strong> {trackingData.driverPhone}
                  </Paragraph>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Трек-номер">
                <Alert
                  message={`TRK-${trackingData.trackingNumber}`}
                  description="Используйте этот номер для отслеживания в мобильном приложении или на сайте"
                  type="info"
                  showIcon
                  icon={<FileTextOutlined />}
                />
                <Divider />
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button type="primary" block icon={<FileTextOutlined />}>
                    Скачать накладную
                  </Button>
                  <Button block icon={<PhoneOutlined />}>
                    Связаться с водителем
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* История событий */}
          <Card title="История событий">
            <Timeline>
              {trackingData.events.map((event) => (
                <Timeline.Item 
                  key={event.id}
                  color={event.status === 'delivered' ? 'green' : event.status === 'cancelled' ? 'red' : 'blue'}
                >
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>{event.description}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatDate(event.timestamp)}
                    </Text>
                  </div>
                  {event.location && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      📍 {event.location}
                    </Text>
                  )}
                  {event.operator && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      👤 {event.operator}
                    </Text>
                  )}
                  {event.notes && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      📝 {event.notes}
                    </Text>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </>
      )}

      {!trackingData && !isLoading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Title level={4} type="secondary">
              Введите номер заказа для отслеживания
            </Title>
            <Text type="secondary">
              Используйте номер заказа или трек-номер для получения актуальной информации о статусе доставки
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
}
