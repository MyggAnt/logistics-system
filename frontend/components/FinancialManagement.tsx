import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, DatePicker, Tag, message, Card, Row, Col, Progress, Tooltip, Badge, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DollarOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
 

interface InvoiceData {
  key: string;
  id: string;
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  type: 'customer' | 'supplier' | 'transport' | 'warehouse';
  customerName: string;
  customerAddress: string;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  paymentTerms: string;
  notes: string;
}

interface ContractData {
  key: string;
  id: string;
  contractNumber: string;
  name: string;
  description: string;
  type: 'supplier' | 'transport' | 'warehouse' | 'service';
  counterpartyName: string;
  counterpartyAddress: string;
  startDate: string;
  endDate: string;
  actualEndDate?: string;
  status: 'draft' | 'active' | 'suspended' | 'terminated' | 'expired';
  totalValue: number;
  currency: string;
  paymentTerms: string;
  deliveryTerms: string;
  qualityStandards: string;
  penaltyTerms: string;
  notes: string;
}

const mockInvoices: InvoiceData[] = [
  {
    key: '1',
    id: '1',
    invoiceNumber: 'INV-2024-001',
    status: 'paid',
    type: 'customer',
    customerName: 'ООО "Рога и Копыта"',
    customerAddress: 'Москва, ул. Тверская, 1',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    paymentDate: '2024-01-20',
    subtotal: 50000,
    taxAmount: 9000,
    discountAmount: 2000,
    totalAmount: 57000,
    paidAmount: 57000,
    balance: 0,
    paymentTerms: '30 дней',
    notes: 'Оплачено досрочно',
  },
  {
    key: '2',
    id: '2',
    invoiceNumber: 'INV-2024-002',
    status: 'sent',
    type: 'supplier',
    customerName: 'ООО "Поставщик"',
    customerAddress: 'Санкт-Петербург, Невский пр., 100',
    issueDate: '2024-01-16',
    dueDate: '2024-02-16',
    subtotal: 75000,
    taxAmount: 13500,
    discountAmount: 0,
    totalAmount: 88500,
    paidAmount: 0,
    balance: 88500,
    paymentTerms: '45 дней',
    notes: 'Ожидает оплаты',
  },
  {
    key: '3',
    id: '3',
    invoiceNumber: 'INV-2024-003',
    status: 'overdue',
    type: 'transport',
    customerName: 'ООО "Перевозчик"',
    customerAddress: 'Казань, ул. Баумана, 50',
    issueDate: '2024-01-10',
    dueDate: '2024-01-25',
    subtotal: 25000,
    taxAmount: 4500,
    discountAmount: 1000,
    totalAmount: 28500,
    paidAmount: 0,
    balance: 28500,
    paymentTerms: '15 дней',
    notes: 'Просрочен',
  },
];

const mockContracts: ContractData[] = [
  {
    key: '1',
    id: '1',
    contractNumber: 'CNT-2024-001',
    name: 'Договор поставки товаров',
    description: 'Поставка продуктов питания',
    type: 'supplier',
    counterpartyName: 'ООО "Поставщик продуктов"',
    counterpartyAddress: 'Москва, ул. Ленина, 10',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    totalValue: 5000000,
    currency: 'RUB',
    paymentTerms: '30 дней',
    deliveryTerms: 'FCA склад поставщика',
    qualityStandards: 'ГОСТ, ТУ',
    penaltyTerms: '0.1% за каждый день просрочки',
    notes: 'Действующий договор',
  },
  {
    key: '2',
    id: '2',
    contractNumber: 'CNT-2024-002',
    name: 'Договор транспортных услуг',
    description: 'Перевозка грузов по России',
    type: 'transport',
    counterpartyName: 'ООО "Транспортная компания"',
    counterpartyAddress: 'Санкт-Петербург, ул. Невская, 20',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    totalValue: 2000000,
    currency: 'RUB',
    paymentTerms: '15 дней',
    deliveryTerms: 'FCA склад отправителя',
    qualityStandards: 'Своевременность доставки 95%',
    penaltyTerms: '0.05% за каждый день просрочки',
    notes: 'Действующий договор',
  },
  {
    key: '3',
    id: '3',
    contractNumber: 'CNT-2024-003',
    name: 'Договор аренды склада',
    description: 'Аренда складских помещений',
    type: 'warehouse',
    counterpartyName: 'ООО "Склад-Сервис"',
    counterpartyAddress: 'Москва, ул. Складская, 5',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    totalValue: 1200000,
    currency: 'RUB',
    paymentTerms: 'Ежемесячно',
    deliveryTerms: 'Склад готов к использованию',
    qualityStandards: 'Температурный режим +2...+8°C',
    penaltyTerms: '0.1% за каждый день нарушения условий',
    notes: 'Действующий договор',
  },
];

const invoiceStatusColors = {
  draft: 'default',
  sent: 'blue',
  paid: 'green',
  overdue: 'red',
  cancelled: 'red',
};

const invoiceStatusLabels = {
  draft: 'Черновик',
  sent: 'Отправлен',
  paid: 'Оплачен',
  overdue: 'Просрочен',
  cancelled: 'Отменен',
};

const invoiceTypeColors = {
  customer: 'blue',
  supplier: 'orange',
  transport: 'green',
  warehouse: 'purple',
};

const invoiceTypeLabels = {
  customer: 'Клиент',
  supplier: 'Поставщик',
  transport: 'Транспорт',
  warehouse: 'Склад',
};

const contractStatusColors = {
  draft: 'default',
  active: 'green',
  suspended: 'orange',
  terminated: 'red',
  expired: 'red',
};

const contractStatusLabels = {
  draft: 'Черновик',
  active: 'Активен',
  suspended: 'Приостановлен',
  terminated: 'Расторгнут',
  expired: 'Истек',
};

const contractTypeColors = {
  supplier: 'blue',
  transport: 'green',
  warehouse: 'purple',
  service: 'orange',
};

const contractTypeLabels = {
  supplier: 'Поставщик',
  transport: 'Транспорт',
  warehouse: 'Склад',
  service: 'Услуги',
};

export default function FinancialManagement() {
  const [activeTab, setActiveTab] = useState('invoices');

  return (
    <div>
      <Card>
        <h2>Финансовое управление</h2>
        
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'invoices',
              label: 'Счета и акты',
              children: <InvoiceManagement />,
            },
            {
              key: 'contracts',
              label: 'Договоры',
              children: <ContractManagement />,
            }
          ]}
        />
      </Card>
    </div>
  );
}

function InvoiceManagement() {
  const [data, setData] = useState<InvoiceData[]>(mockInvoices);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceData | null>(null);
  const [form] = Form.useForm();

  const getPaymentStatus = (invoice: InvoiceData) => {
    if (invoice.status === 'paid') return 'success';
    if (invoice.status === 'overdue') return 'exception';
    if (invoice.status === 'sent') return 'active';
    return 'normal';
  };

  const getPaymentProgress = (invoice: InvoiceData) => {
    return Math.round((invoice.paidAmount / invoice.totalAmount) * 100);
  };

  const columns: ColumnsType<InvoiceData> = [
    {
      title: 'Номер счета',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={invoiceStatusColors[status as keyof typeof invoiceStatusColors]}>
          {invoiceStatusLabels[status as keyof typeof invoiceStatusLabels]}
        </Tag>
      ),
      filters: Object.entries(invoiceStatusLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={invoiceTypeColors[type as keyof typeof invoiceTypeColors]}>
          {invoiceTypeLabels[type as keyof typeof invoiceTypeLabels]}
        </Tag>
      ),
      filters: Object.entries(invoiceTypeLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Контрагент',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.customerAddress}
          </div>
        </div>
      ),
    },
    {
      title: 'Даты',
      key: 'dates',
      render: (_, record) => (
        <div>
          <div>Выдан: {record.issueDate}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Срок: {record.dueDate}
          </div>
          {record.paymentDate && (
            <div style={{ fontSize: '12px', color: '#52c41a' }}>
              Оплачен: {record.paymentDate}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Суммы',
      key: 'amounts',
      render: (_, record) => (
        <div>
          <div>Итого: {record.totalAmount.toLocaleString()} ₽</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            НДС: {record.taxAmount.toLocaleString()} ₽
          </div>
          {record.discountAmount > 0 && (
            <div style={{ fontSize: '12px', color: '#faad14' }}>
              Скидка: {record.discountAmount.toLocaleString()} ₽
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Оплата',
      key: 'payment',
      render: (_, record) => {
        const progress = getPaymentProgress(record);
        const status = getPaymentStatus(record);
        
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              {record.paidAmount.toLocaleString()} / {record.totalAmount.toLocaleString()} ₽
            </div>
            <Progress
              percent={progress}
              size="small"
              status={status}
              format={(percent) => `${percent}%`}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
              Остаток: {record.balance.toLocaleString()} ₽
            </div>
          </div>
        );
      },
    },
    {
      title: 'Условия',
      key: 'terms',
      render: (_, record) => (
        <div>
          <div>Оплата: {record.paymentTerms}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.notes}
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
    setEditingInvoice(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (invoice: InvoiceData) => {
    setEditingInvoice(invoice);
    form.setFieldsValue(invoice);
    setIsModalVisible(true);
  };

  const handleDelete = (invoice: InvoiceData) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: `Вы уверены, что хотите удалить счет "${invoice.invoiceNumber}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        setData(data.filter(item => item.key !== invoice.key));
        message.success('Счет успешно удален');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingInvoice) {
        setData(data.map(item =>
          item.key === editingInvoice.key ? { ...item, ...values } : item
        ));
        message.success('Счет успешно обновлен');
      } else {
        const newInvoice: InvoiceData = {
          key: Date.now().toString(),
          id: Date.now().toString(),
          invoiceNumber: `INV-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...values,
        };
        setData([...data, newInvoice]);
        message.success('Счет успешно создан');
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
          <h3>Управление счетами и актами</h3>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Добавить счет
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
            `${range[0]}-${range[1]} из ${total} счетов`,
        }}
        scroll={{ x: 1400 }}
      />

      <Modal
        title={editingInvoice ? 'Редактировать счет' : 'Добавить счет'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingInvoice ? 'Обновить' : 'Создать'}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'draft',
            type: 'customer',
            currency: 'RUB',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Тип счета"
                rules={[{ required: true, message: 'Выберите тип счета' }]}
              >
                <Select placeholder="Выберите тип">
                  {Object.entries(invoiceTypeLabels).map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Статус"
                rules={[{ required: true, message: 'Выберите статус' }]}
              >
                <Select placeholder="Выберите статус">
                  {Object.entries(invoiceStatusLabels).map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Наименование контрагента"
                rules={[{ required: true, message: 'Введите наименование' }]}
              >
                <Input placeholder="Введите наименование" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerAddress"
                label="Адрес контрагента"
                rules={[{ required: true, message: 'Введите адрес' }]}
              >
                <Input placeholder="Введите адрес" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="issueDate"
                label="Дата выдачи"
                rules={[{ required: true, message: 'Выберите дату' }]}
              >
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dueDate"
                label="Срок оплаты"
                rules={[{ required: true, message: 'Выберите дату' }]}
              >
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="paymentTerms"
                label="Условия оплаты"
                rules={[{ required: true, message: 'Введите условия' }]}
              >
                <Input placeholder="Например: 30 дней" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="subtotal"
                label="Сумма без НДС (₽)"
                rules={[{ required: true, message: 'Введите сумму' }]}
              >
                <Input type="number" placeholder="Введите сумму" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="taxAmount"
                label="Сумма НДС (₽)"
                rules={[{ required: true, message: 'Введите НДС' }]}
              >
                <Input type="number" placeholder="Введите НДС" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="discountAmount"
                label="Скидка (₽)"
              >
                <Input type="number" placeholder="Введите скидку" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="paidAmount"
                label="Оплачено (₽)"
                rules={[{ required: true, message: 'Введите сумму' }]}
              >
                <Input type="number" placeholder="Введите сумму" />
              </Form.Item>
            </Col>
            <Col span={12}>
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

function ContractManagement() {
  const [data, setData] = useState<ContractData[]>(mockContracts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractData | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<ContractData> = [
    {
      title: 'Номер договора',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      sorter: (a, b) => a.contractNumber.localeCompare(b.contractNumber),
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
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={contractStatusColors[status as keyof typeof contractStatusColors]}>
          {contractStatusLabels[status as keyof typeof contractStatusLabels]}
        </Tag>
      ),
      filters: Object.entries(contractStatusLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={contractTypeColors[type as keyof typeof contractTypeColors]}>
          {contractTypeLabels[type as keyof typeof contractTypeLabels]}
        </Tag>
      ),
      filters: Object.entries(contractTypeLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Контрагент',
      dataIndex: 'counterpartyName',
      key: 'counterpartyName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.counterpartyAddress}
          </div>
        </div>
      ),
    },
    {
      title: 'Срок действия',
      key: 'period',
      render: (_, record) => (
        <div>
          <div>С: {record.startDate}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            По: {record.endDate}
          </div>
          {record.actualEndDate && (
            <div style={{ fontSize: '12px', color: '#faad14' }}>
              Факт: {record.actualEndDate}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Стоимость',
      key: 'value',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>
            {record.totalValue.toLocaleString()} {record.currency}
          </div>
        </div>
      ),
    },
    {
      title: 'Условия',
      key: 'terms',
      render: (_, record) => (
        <div>
          <div>Оплата: {record.paymentTerms}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Поставка: {record.deliveryTerms}
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
    setEditingContract(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (contract: ContractData) => {
    setEditingContract(contract);
    form.setFieldsValue(contract);
    setIsModalVisible(true);
  };

  const handleDelete = (contract: ContractData) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: `Вы уверены, что хотите удалить договор "${contract.name}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        setData(data.filter(item => item.key !== contract.key));
        message.success('Договор успешно удален');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingContract) {
        setData(data.map(item =>
          item.key === editingContract.key ? { ...item, ...values } : item
        ));
        message.success('Договор успешно обновлен');
      } else {
        const newContract: ContractData = {
          key: Date.now().toString(),
          id: Date.now().toString(),
          contractNumber: `CNT-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...values,
        };
        setData([...data, newContract]);
        message.success('Договор успешно создан');
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
          <h3>Управление договорами</h3>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Добавить договор
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
            `${range[0]}-${range[1]} из ${total} договоров`,
        }}
        scroll={{ x: 1400 }}
      />

      <Modal
        title={editingContract ? 'Редактировать договор' : 'Добавить договор'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingContract ? 'Обновить' : 'Создать'}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'draft',
            type: 'supplier',
            currency: 'RUB',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Название договора"
                rules={[{ required: true, message: 'Введите название' }]}
              >
                <Input placeholder="Введите название" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Тип договора"
                rules={[{ required: true, message: 'Выберите тип' }]}
              >
                <Select placeholder="Выберите тип">
                  {Object.entries(contractTypeLabels).map(([value, label]) => (
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
                <TextArea rows={2} placeholder="Введите описание договора" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="counterpartyName"
                label="Наименование контрагента"
                rules={[{ required: true, message: 'Введите наименование' }]}
              >
                <Input placeholder="Введите наименование" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="counterpartyAddress"
                label="Адрес контрагента"
                rules={[{ required: true, message: 'Введите адрес' }]}
              >
                <Input placeholder="Введите адрес" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="startDate"
                label="Дата начала"
                rules={[{ required: true, message: 'Выберите дату' }]}
              >
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endDate"
                label="Дата окончания"
                rules={[{ required: true, message: 'Выберите дату' }]}
              >
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Статус"
                rules={[{ required: true, message: 'Выберите статус' }]}
              >
                <Select placeholder="Выберите статус">
                  {Object.entries(contractStatusLabels).map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="totalValue"
                label="Общая стоимость"
                rules={[{ required: true, message: 'Введите стоимость' }]}
              >
                <Input type="number" placeholder="Введите стоимость" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="currency"
                label="Валюта"
                rules={[{ required: true, message: 'Выберите валюту' }]}
              >
                <Select>
                  <Option value="RUB">RUB</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="paymentTerms"
                label="Условия оплаты"
                rules={[{ required: true, message: 'Введите условия' }]}
              >
                <Input placeholder="Например: 30 дней" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deliveryTerms"
                label="Условия поставки"
                rules={[{ required: true, message: 'Введите условия' }]}
              >
                <Input placeholder="Например: FCA склад поставщика" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="qualityStandards"
                label="Стандарты качества"
                rules={[{ required: true, message: 'Введите стандарты' }]}
              >
                <Input placeholder="Например: ГОСТ, ТУ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="penaltyTerms"
                label="Условия штрафов"
              >
                <TextArea rows={2} placeholder="Введите условия штрафов" />
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
