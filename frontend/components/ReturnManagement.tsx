import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, DatePicker, Tag, message, Card, Row, Col, Progress, Tooltip, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

interface ReturnData {
  key: string;
  id: string;
  returnId: string;
  name: string;
  description: string;
  type: 'customer_return' | 'supplier_return' | 'quality_issue' | 'damaged' | 'expired';
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  originalOrderId: string;
  customerName: string;
  returnDate: string;
  approvedDate?: string;
  processedDate?: string;
  completedDate?: string;
  reason: string;
  customerNotes: string;
  internalNotes: string;
  refundAmount: number;
  refundMethod: string;
  trackingNumber: string;
  returnLabel: string;
  totalItems: number;
  processedItems: number;
  warehouseId: string;
  assignedTo: string;
}

const mockData: ReturnData[] = [
  {
    key: '1',
    id: '1',
    returnId: 'RET-2024-001',
    name: 'Возврат молока',
    description: 'Возврат просроченного молока от клиента',
    type: 'customer_return',
    status: 'completed',
    originalOrderId: 'ORD-001',
    customerName: 'ООО "Рога и Копыта"',
    returnDate: '2024-01-15',
    approvedDate: '2024-01-16',
    processedDate: '2024-01-17',
    completedDate: '2024-01-18',
    reason: 'Просроченный товар',
    customerNotes: 'Товар был просрочен на момент получения',
    internalNotes: 'Возврат принят, товар утилизирован',
    refundAmount: 5700,
    refundMethod: 'Возврат на карту',
    trackingNumber: 'TRK-RET-001',
    returnLabel: 'RET-LBL-001',
    totalItems: 3,
    processedItems: 3,
    warehouseId: 'WH-001',
    assignedTo: 'Иванов А.П.',
  },
  {
    key: '2',
    id: '2',
    returnId: 'RET-2024-002',
    name: 'Возврат поставщику',
    description: 'Возврат бракованных батареек поставщику',
    type: 'supplier_return',
    status: 'processing',
    originalOrderId: 'ORD-003',
    customerName: 'ООО "Поставщик батареек"',
    returnDate: '2024-01-14',
    approvedDate: '2024-01-15',
    processedDate: '2024-01-16',
    reason: 'Бракованный товар',
    customerNotes: 'Обнаружен брак в партии',
    internalNotes: 'Отправлен запрос поставщику на замену',
    refundAmount: 0,
    refundMethod: 'Замена товара',
    trackingNumber: 'TRK-RET-002',
    returnLabel: 'RET-LBL-002',
    totalItems: 50,
    processedItems: 25,
    warehouseId: 'WH-001',
    assignedTo: 'Петрова Е.В.',
  },
  {
    key: '3',
    id: '3',
    returnId: 'RET-2024-003',
    name: 'Возврат хлеба',
    description: 'Возврат заплесневелого хлеба',
    type: 'quality_issue',
    status: 'pending',
    originalOrderId: 'ORD-002',
    customerName: 'ИП Иванов',
    returnDate: '2024-01-16',
    reason: 'Плесень на товаре',
    customerNotes: 'Хлеб покрыт плесенью',
    internalNotes: 'Требуется проверка качества',
    refundAmount: 4500,
    refundMethod: 'Возврат наличными',
    trackingNumber: '',
    returnLabel: '',
    totalItems: 2,
    processedItems: 0,
    warehouseId: 'WH-001',
    assignedTo: 'Сидоров М.И.',
  },
];

const typeColors = {
  customer_return: 'blue',
  supplier_return: 'orange',
  quality_issue: 'red',
  damaged: 'purple',
  expired: 'brown',
};

const typeLabels = {
  customer_return: 'Возврат клиента',
  supplier_return: 'Возврат поставщику',
  quality_issue: 'Проблема качества',
  damaged: 'Поврежденный товар',
  expired: 'Просроченный товар',
};

const statusColors = {
  pending: 'orange',
  approved: 'blue',
  processing: 'cyan',
  completed: 'green',
  rejected: 'red',
  cancelled: 'gray',
};

const statusLabels = {
  pending: 'Ожидает',
  approved: 'Одобрен',
  processing: 'Обрабатывается',
  completed: 'Завершен',
  rejected: 'Отклонен',
  cancelled: 'Отменен',
};

export default function ReturnManagement() {
  const [data, setData] = useState<ReturnData[]>(mockData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReturn, setEditingReturn] = useState<ReturnData | null>(null);
  const [form] = Form.useForm();

  const getReturnProgress = (return_: ReturnData) => {
    if (return_.status === 'completed') return 100;
    if (return_.status === 'processing') return 75;
    if (return_.status === 'approved') return 50;
    if (return_.status === 'pending') return 25;
    return 0;
  };

  const getReturnStatus = (return_: ReturnData) => {
    if (return_.status === 'completed') return 'success';
    if (return_.status === 'processing') return 'active';
    if (return_.status === 'approved') return 'normal';
    if (return_.status === 'pending') return 'normal';
    return 'exception';
  };

  const columns: ColumnsType<ReturnData> = [
    {
      title: 'ID возврата',
      dataIndex: 'returnId',
      key: 'returnId',
      sorter: (a, b) => a.returnId.localeCompare(b.returnId),
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
        <Tag color={typeColors[type as keyof typeof typeColors]}>
          {typeLabels[type as keyof typeof typeLabels]}
        </Tag>
      ),
      filters: Object.entries(typeLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.type === value,
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
              percent={getReturnProgress({ status } as ReturnData)}
              size="small"
              status={getReturnStatus({ status } as ReturnData)}
              format={(percent) => `${percent}%`}
            />
          </div>
        </div>
      ),
      filters: Object.entries(statusLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Заказ',
      key: 'order',
      render: (_, record) => (
        <div>
          <div>Заказ: {record.originalOrderId}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Клиент: {record.customerName}
          </div>
        </div>
      ),
    },
    {
      title: 'Даты',
      key: 'dates',
      render: (_, record) => (
        <div>
          <div>Возврат: {record.returnDate}</div>
          {record.approvedDate && (
            <div style={{ fontSize: '12px', color: '#52c41a' }}>
              Одобрен: {record.approvedDate}
            </div>
          )}
          {record.processedDate && (
            <div style={{ fontSize: '12px', color: '#1890ff' }}>
              Обработан: {record.processedDate}
            </div>
          )}
          {record.completedDate && (
            <div style={{ fontSize: '12px', color: '#52c41a' }}>
              Завершен: {record.completedDate}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Причина',
      key: 'reason',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.reason}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.customerNotes}
          </div>
        </div>
      ),
    },
    {
      title: 'Возврат',
      key: 'refund',
      render: (_, record) => (
        <div>
          {record.refundAmount > 0 ? (
            <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
              {record.refundAmount.toLocaleString()} ₽
            </div>
          ) : (
            <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
              Замена товара
            </div>
          )}
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.refundMethod}
          </div>
        </div>
      ),
    },
    {
      title: 'Товары',
      key: 'items',
      render: (_, record) => (
        <div>
          <div>Обработано: {record.processedItems} / {record.totalItems}</div>
          <Progress
            percent={Math.round((record.processedItems / record.totalItems) * 100)}
            size="small"
            status={record.processedItems === record.totalItems ? 'success' : 'active'}
          />
        </div>
      ),
    },
    {
      title: 'Логистика',
      key: 'logistics',
      render: (_, record) => (
        <div>
          <div>Склад: {record.warehouseId}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Ответственный: {record.assignedTo}
          </div>
          {record.trackingNumber && (
            <div style={{ fontSize: '12px', color: '#1890ff' }}>
              Трек: {record.trackingNumber}
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
    setEditingReturn(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (return_: ReturnData) => {
    setEditingReturn(return_);
    form.setFieldsValue(return_);
    setIsModalVisible(true);
  };

  const handleDelete = (return_: ReturnData) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: `Вы уверены, что хотите удалить возврат "${return_.name}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        setData(data.filter(item => item.key !== return_.key));
        message.success('Возврат успешно удален');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingReturn) {
        setData(data.map(item =>
          item.key === editingReturn.key ? { ...item, ...values } : item
        ));
        message.success('Возврат успешно обновлен');
      } else {
        const newReturn: ReturnData = {
          key: Date.now().toString(),
          id: Date.now().toString(),
          returnId: `RET-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...values,
        };
        setData([...data, newReturn]);
        message.success('Возврат успешно создан');
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
            <h2>Управление возвратами</h2>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Добавить возврат
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
              `${range[0]}-${range[1]} из ${total} возвратов`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title={editingReturn ? 'Редактировать возврат' : 'Добавить возврат'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingReturn ? 'Обновить' : 'Создать'}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'pending',
            type: 'customer_return',
            refundMethod: 'Возврат на карту',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Название возврата"
                rules={[{ required: true, message: 'Введите название' }]}
              >
                <Input placeholder="Введите название" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Тип возврата"
                rules={[{ required: true, message: 'Выберите тип' }]}
              >
                <Select placeholder="Выберите тип">
                  {Object.entries(typeLabels).map(([value, label]) => (
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
                <TextArea rows={2} placeholder="Введите описание возврата" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="originalOrderId"
                label="ID оригинального заказа"
                rules={[{ required: true, message: 'Введите ID заказа' }]}
              >
                <Input placeholder="Введите ID заказа" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Наименование клиента"
                rules={[{ required: true, message: 'Введите наименование' }]}
              >
                <Input placeholder="Введите наименование" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="returnDate"
                label="Дата возврата"
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
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalItems"
                label="Количество товаров"
                rules={[{ required: true, message: 'Введите количество' }]}
              >
                <Input type="number" placeholder="Введите количество" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="reason"
                label="Причина возврата"
                rules={[{ required: true, message: 'Введите причину' }]}
              >
                <Input placeholder="Введите причину" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="refundAmount"
                label="Сумма возврата (₽)"
              >
                <Input type="number" placeholder="Введите сумму" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="refundMethod"
                label="Способ возврата"
                rules={[{ required: true, message: 'Введите способ' }]}
              >
                <Input placeholder="Например: Возврат на карту" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                name="assignedTo"
                label="Ответственный"
                rules={[{ required: true, message: 'Введите ответственного' }]}
              >
                <Input placeholder="Введите ФИО" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="trackingNumber"
                label="Номер отслеживания"
              >
                <Input placeholder="Введите номер" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerNotes"
                label="Заметки клиента"
              >
                <TextArea rows={2} placeholder="Введите заметки клиента" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="internalNotes"
                label="Внутренние заметки"
              >
                <TextArea rows={2} placeholder="Введите внутренние заметки" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
