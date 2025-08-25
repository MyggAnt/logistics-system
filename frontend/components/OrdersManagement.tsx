import React, { useState } from 'react';
import { 
  Table, Button, Input, Space, Modal, Form, Select, DatePicker, Tag, message, 
  Card, Row, Col, Tabs, Badge, Tooltip, Popconfirm, Divider, Typography,
  Alert, Drawer
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, 
  EyeOutlined, TruckOutlined, FileTextOutlined, SyncOutlined, 
  CheckCircleOutlined, ExclamationCircleOutlined, PrinterOutlined, 
  DownloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;
const { TabPane } = Tabs;

// Интерфейсы для заказов
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availableStock: number;
  reservedStock: number;
  location: string;
}

interface OrderData {
  key: string;
  id: string;
  orderNumber: string;
  orderType: 'internal' | 'retail' | 'ecommerce' | 'procurement';
  channel: 'distribution_center' | 'hypermarket' | 'online_store' | 'external_supplier';
  customerName: string;
  customerType: 'business' | 'individual';
  destination: string;
  sourceLocation: string;
  status: 'draft' | 'confirmed' | 'processing' | 'picking' | 'packed' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  totalAmount: number;
  deliveryCost: number;
  totalCost: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue';
  logisticsBatchId?: string;
  vehicleId?: string;
  driverId?: string;
  trackingNumber?: string;
  notes?: string;
  items: OrderItem[];
  documents: string[];
  tags: string[];
  lastUpdated: string;
  createdBy: string;
  assignedTo?: string;
}

// Моковые данные
const mockData: OrderData[] = [
  {
    key: '1',
    id: '1',
    orderNumber: 'ORD-2024-001',
    orderType: 'retail',
    channel: 'hypermarket',
    customerName: 'Гипермаркет "МегаМолл"',
    customerType: 'business',
    destination: 'Москва, ул. Тверская, 1',
    sourceLocation: 'РЦ "Москва-Центральный"',
    status: 'processing',
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    estimatedDelivery: '2024-01-17T18:00:00Z',
    totalAmount: 150000,
    deliveryCost: 5000,
    totalCost: 155000,
    currency: 'RUB',
    paymentStatus: 'paid',
    logisticsBatchId: 'BATCH-001',
    notes: 'Срочная поставка для акции',
    items: [
      {
        id: '1',
        productId: 'PROD-001',
        productName: 'Товар А',
        quantity: 100,
        unitPrice: 1500,
        totalPrice: 150000,
        availableStock: 200,
        reservedStock: 100,
        location: 'A-01-01'
      }
    ],
    documents: ['invoice.pdf', 'packing_list.pdf'],
    tags: ['срочно', 'акция'],
    lastUpdated: '2024-01-15T14:30:00Z',
    createdBy: 'user1',
    assignedTo: 'user2'
  },
  {
    key: '2',
    id: '2',
    orderNumber: 'ORD-2024-002',
    orderType: 'ecommerce',
    channel: 'online_store',
    customerName: 'Иванов Иван Иванович',
    customerType: 'individual',
    destination: 'Санкт-Петербург, Невский пр., 100, кв. 25',
    sourceLocation: 'Склад "СПб-Основной"',
    status: 'shipped',
    priority: 'medium',
    createdAt: '2024-01-14T15:30:00Z',
    estimatedDelivery: '2024-01-16T20:00:00Z',
    trackingNumber: 'TRK-001234',
    totalAmount: 8500,
    deliveryCost: 500,
    totalCost: 9000,
    currency: 'RUB',
    paymentStatus: 'paid',
    vehicleId: 'VEH-001',
    notes: 'Доставка до двери',
    items: [
      {
        id: '2',
        productId: 'PROD-002',
        productName: 'Товар Б',
        quantity: 2,
        unitPrice: 4000,
        totalPrice: 8000,
        availableStock: 50,
        reservedStock: 2,
        location: 'B-02-03'
      }
    ],
    documents: ['invoice.pdf'],
    tags: ['онлайн', 'доставка'],
    lastUpdated: '2024-01-15T09:15:00Z',
    createdBy: 'system',
    assignedTo: 'courier1'
  },
  {
    key: '3',
    id: '3',
    orderNumber: 'ORD-2024-003',
    orderType: 'procurement',
    channel: 'external_supplier',
    customerName: 'ООО "ЛогистикСистемс"',
    customerType: 'business',
    destination: 'РЦ "Москва-Центральный"',
    sourceLocation: 'Поставщик "ТоварПром"',
    status: 'confirmed',
    priority: 'medium',
    createdAt: '2024-01-13T08:00:00Z',
    estimatedDelivery: '2024-01-20T12:00:00Z',
    totalAmount: 500000,
    deliveryCost: 15000,
    totalCost: 515000,
    currency: 'RUB',
    paymentStatus: 'pending',
    notes: 'Поставка товаров для пополнения склада',
    items: [
      {
        id: '3',
        productId: 'PROD-003',
        productName: 'Товар В',
        quantity: 500,
        unitPrice: 1000,
        totalPrice: 500000,
        availableStock: 0,
        reservedStock: 0,
        location: 'Ожидает поставки'
      }
    ],
    documents: ['purchase_order.pdf'],
    tags: ['закупка', 'пополнение'],
    lastUpdated: '2024-01-14T16:45:00Z',
    createdBy: 'user3'
  }
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

const priorityColors = {
  low: 'green',
  medium: 'orange',
  high: 'red',
  urgent: 'volcano'
};

const orderTypeLabels = {
  internal: 'Внутренний',
  retail: 'Розничный',
  ecommerce: 'E-commerce',
  procurement: 'Закупочный'
};

const channelLabels = {
  distribution_center: 'РЦ',
  hypermarket: 'Гипермаркет',
  online_store: 'Интернет-магазин',
  external_supplier: 'Внешний поставщик'
};

export default function OrdersManagement() {
  const [data, setData] = useState<OrderData[]>(mockData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsDrawerVisible, setIsDetailsDrawerVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Фильтрация по типу заказа
  const filteredData = data.filter(order => {
    if (activeTab === 'all') return true;
    return order.orderType === activeTab;
  });

  // Поиск
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const searchedData = filteredData.filter(order =>
    order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
    order.destination.toLowerCase().includes(searchText.toLowerCase())
  );

  // Вспомогательные функции
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

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
      urgent: 'Срочно'
    };
    return labels[priority] || priority;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency || 'RUB'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Обработчики событий
  const showOrderDetails = (order: OrderData) => {
    setSelectedOrder(order);
    setIsDetailsDrawerVisible(true);
  };

  const handleEdit = (record: OrderData) => {
    setEditingOrder(record);
    form.setFieldsValue({
      ...record,
      estimatedDelivery: record.estimatedDelivery ? new Date(record.estimatedDelivery) : null
    });
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setData(data.filter(item => item.key !== key));
    message.success('Заказ удален');
  };

  const handleAdd = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingOrder) {
        setData(data.map(item => 
          item.key === editingOrder.key ? { ...item, ...values } : item
        ));
        message.success('Заказ обновлен');
      } else {
        const newOrder: OrderData = {
          key: Date.now().toString(),
          id: Date.now().toString(),
          orderNumber: `ORD-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...values,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          createdBy: 'current_user',
          items: [],
          documents: [],
          tags: [],
          totalAmount: 0,
          deliveryCost: 0,
          totalCost: 0,
          currency: 'RUB',
          paymentStatus: 'pending'
        };
        setData([...data, newOrder]);
        message.success('Заказ создан');
      }
      setIsModalVisible(false);
    });
  };

  // Статистика
  const getStatistics = () => {
    const total = data.length;
    const byStatus = data.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byType = data.reduce((acc, order) => {
      acc[order.orderType] = (acc[order.orderType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byStatus, byType };
  };

  const stats = getStatistics();

  // Колонки таблицы
  const columns: ColumnsType<OrderData> = [
    {
      title: '№ заказа',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      fixed: 'left',
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => showOrderDetails(record)}
          style={{ padding: 0, height: 'auto' }}
        >
          {text}
        </Button>
      )
    },
    {
      title: 'Тип',
      dataIndex: 'orderType',
      key: 'orderType',
      width: 120,
      render: (type: string) => (
        <Tag color={type === 'procurement' ? 'purple' : type === 'ecommerce' ? 'blue' : type === 'retail' ? 'green' : 'orange'}>
          {orderTypeLabels[type as keyof typeof orderTypeLabels]}
        </Tag>
      ),
      filters: Object.entries(orderTypeLabels).map(([value, label]) => ({ text: label, value }))
    },
    {
      title: 'Канал',
      dataIndex: 'channel',
      key: 'channel',
      width: 140,
      render: (channel: string) => (
        <Tag color={channel === 'distribution_center' ? 'blue' : channel === 'hypermarket' ? 'green' : channel === 'online_store' ? 'cyan' : 'orange'}>
          {channelLabels[channel as keyof typeof channelLabels]}
        </Tag>
      )
    },
    {
      title: 'Клиент',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Badge 
          status={statusColors[status as keyof typeof statusColors] as any} 
          text={
            <span style={{ fontSize: '12px' }}>
              {getStatusLabel(status)}
            </span>
          } 
        />
      ),
      filters: [
        { text: 'Черновик', value: 'draft' },
        { text: 'Подтвержден', value: 'confirmed' },
        { text: 'Обрабатывается', value: 'processing' },
        { text: 'Комплектуется', value: 'picking' },
        { text: 'Упакован', value: 'packed' },
        { text: 'Отправлен', value: 'shipped' },
        { text: 'В пути', value: 'in_transit' },
        { text: 'Доставлен', value: 'delivered' },
        { text: 'Отменен', value: 'cancelled' },
        { text: 'Возврат', value: 'returned' }
      ]
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={priorityColors[priority as keyof typeof priorityColors]}>
          {getPriorityLabel(priority)}
        </Tag>
      )
    },
    {
      title: 'Сумма',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 120,
      render: (amount, record) => (
        <span>
          {formatCurrency(amount, record.currency)}
        </span>
      ),
      sorter: (a, b) => a.totalCost - b.totalCost
    },
    {
      title: 'Дата доставки',
      dataIndex: 'estimatedDelivery',
      key: 'estimatedDelivery',
      width: 140,
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.estimatedDelivery).getTime() - new Date(b.estimatedDelivery).getTime()
    },
    {
      title: 'Логистическая партия',
      dataIndex: 'logisticsBatchId',
      key: 'logisticsBatchId',
      width: 140,
      render: (batchId) => batchId ? (
        <Tag color="blue" icon={<TruckOutlined />}>
          {batchId}
        </Tag>
      ) : '-'
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Просмотр деталей">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showOrderDetails(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Popconfirm
              title="Удалить заказ?"
              description="Это действие нельзя отменить"
              onConfirm={() => handleDelete(record.key)}
              okText="Да"
              cancelText="Нет"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Управление заказами</Title>
      
      {/* Статистика */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }}>
                <FileTextOutlined /> {stats.total}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Всего заказов</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }}>
                <SyncOutlined /> {stats.byStatus.processing || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>В обработке</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }}>
                <CheckCircleOutlined /> {data.filter(o => 
                  o.status === 'delivered' && 
                  new Date(o.actualDelivery || '').toDateString() === new Date().toDateString()
                ).length}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Доставлено сегодня</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#fa541c', marginBottom: '8px' }}>
                <ExclamationCircleOutlined /> {data.filter(o => o.priority === 'urgent').length}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Срочные заказы</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Фильтры и поиск */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="Поиск по номеру, клиенту или адресу"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </Col>
          <Col span={8}>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              size="small"
            >
              <TabPane tab="Все" key="all" />
              <TabPane tab="Внутренние" key="internal" />
              <TabPane tab="Розничные" key="retail" />
              <TabPane tab="E-commerce" key="ecommerce" />
              <TabPane tab="Закупочные" key="procurement" />
            </Tabs>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleAdd}
            >
              Создать заказ
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Таблица заказов */}
      <Card>
        <Table
          columns={columns}
          dataSource={searchedData}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} из ${total} заказов`,
          }}
          rowKey="key"
        />
      </Card>

      {/* Модальное окно создания/редактирования заказа */}
      <Modal
        title={editingOrder ? 'Редактировать заказ' : 'Создать заказ'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="orderType"
                label="Тип заказа"
                rules={[{ required: true, message: 'Выберите тип заказа' }]}
              >
                <Select placeholder="Выберите тип заказа">
                  <Option value="internal">Внутренний</Option>
                  <Option value="retail">Розничный</Option>
                  <Option value="ecommerce">E-commerce</Option>
                  <Option value="procurement">Закупочный</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="channel"
                label="Канал поступления"
                rules={[{ required: true, message: 'Выберите канал' }]}
              >
                <Select placeholder="Выберите канал">
                  <Option value="distribution_center">РЦ</Option>
                  <Option value="hypermarket">Гипермаркет</Option>
                  <Option value="online_store">Интернет-магазин</Option>
                  <Option value="external_supplier">Внешний поставщик</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Название клиента"
                rules={[{ required: true, message: 'Введите название клиента' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerType"
                label="Тип клиента"
                rules={[{ required: true, message: 'Выберите тип клиента' }]}
              >
                <Select placeholder="Выберите тип клиента">
                  <Option value="business">Юридическое лицо</Option>
                  <Option value="individual">Физическое лицо</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="destination"
            label="Адрес назначения"
            rules={[{ required: true, message: 'Введите адрес назначения' }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Приоритет"
                rules={[{ required: true, message: 'Выберите приоритет' }]}
              >
                <Select placeholder="Выберите приоритет">
                  <Option value="low">Низкий</Option>
                  <Option value="medium">Средний</Option>
                  <Option value="high">Высокий</Option>
                  <Option value="urgent">Срочно</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estimatedDelivery"
                label="Ожидаемая дата доставки"
                rules={[{ required: true, message: 'Выберите дату доставки' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }} 
                  placeholder="Выберите дату и время"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Примечания"
          >
            <TextArea rows={3} placeholder="Дополнительная информация о заказе" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Детальный просмотр заказа */}
      <Drawer
        title={`Заказ ${selectedOrder?.orderNumber}`}
        placement="right"
        width={600}
        open={isDetailsDrawerVisible}
        onClose={() => setIsDetailsDrawerVisible(false)}
      >
        {selectedOrder && (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                padding: '8px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Номер заказа</div>
                <div>{selectedOrder.orderNumber}</div>
              </div>
              <div style={{ 
                padding: '8px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Тип заказа</div>
                <div>
                  <Tag color={selectedOrder.orderType === 'procurement' ? 'purple' : selectedOrder.orderType === 'ecommerce' ? 'blue' : selectedOrder.orderType === 'retail' ? 'green' : 'orange'}>
                    {orderTypeLabels[selectedOrder.orderType]}
                  </Tag>
                </div>
              </div>
              <div style={{ 
                padding: '8px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Клиент</div>
                <div>{selectedOrder.customerName}</div>
              </div>
              <div style={{ 
                padding: '8px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Адрес назначения</div>
                <div>{selectedOrder.destination}</div>
              </div>
              <div style={{ 
                padding: '8px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Статус</div>
                <div>
                  <Badge status={statusColors[selectedOrder.status] as any} text={getStatusLabel(selectedOrder.status)} />
                </div>
              </div>
              <div style={{ 
                padding: '8px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Приоритет</div>
                <div>
                  <Tag color={priorityColors[selectedOrder.priority]}>{getPriorityLabel(selectedOrder.priority)}</Tag>
                </div>
              </div>
              <div style={{ 
                padding: '8px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Сумма</div>
                <div>{formatCurrency(selectedOrder.totalCost, selectedOrder.currency)}</div>
              </div>
              <div style={{ 
                padding: '8px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Дата создания</div>
                <div>{formatDate(selectedOrder.createdAt)}</div>
              </div>
              <div style={{ 
                padding: '8px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Ожидаемая доставка</div>
                <div>{formatDate(selectedOrder.estimatedDelivery)}</div>
              </div>
            </div>

            <Divider>Товары</Divider>
            <Table
              dataSource={selectedOrder.items}
              columns={[
                { title: 'Товар', dataIndex: 'productName', key: 'productName' },
                { title: 'Количество', dataIndex: 'quantity', key: 'quantity' },
                { title: 'Цена', dataIndex: 'unitPrice', key: 'unitPrice', render: (price) => formatCurrency(price, selectedOrder.currency) },
                { title: 'Сумма', dataIndex: 'totalPrice', key: 'totalPrice', render: (price) => formatCurrency(price, selectedOrder.currency) }
              ]}
              pagination={false}
              size="small"
            />

            {selectedOrder.logisticsBatchId && (
              <>
                <Divider>Логистическая партия</Divider>
                <Alert
                  message={`Партия: ${selectedOrder.logisticsBatchId}`}
                  description="Заказ включен в логистическую партию для оптимизации доставки"
                  type="info"
                  showIcon
                />
              </>
            )}

            {selectedOrder.trackingNumber && (
              <>
                <Divider>Отслеживание</Divider>
                <Alert
                  message={`Трек-номер: ${selectedOrder.trackingNumber}`}
                  description="Используйте этот номер для отслеживания доставки"
                  type="success"
                  showIcon
                />
              </>
            )}

            <Divider>Действия</Divider>
            <Space>
              <Button icon={<EditOutlined />} onClick={() => { setIsDetailsDrawerVisible(false); handleEdit(selectedOrder); }}>
                Редактировать
              </Button>
              <Button icon={<PrinterOutlined />}>Печать</Button>
              <Button icon={<DownloadOutlined />}>Экспорт</Button>
              {selectedOrder.status === 'confirmed' && (
                <Button type="primary" icon={<SyncOutlined />}>Начать обработку</Button>
              )}
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
}
