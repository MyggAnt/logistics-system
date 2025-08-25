import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, DatePicker, Tag, message, Card, Row, Col, Progress, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, HomeOutlined, DatabaseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

interface WarehouseData {
  key: string;
  id: string;
  warehouseId: string;
  name: string;
  type: 'distribution_center' | 'hypermarket' | 'warehouse' | 'cross_dock';
  status: 'active' | 'inactive' | 'maintenance' | 'closed';
  address: string;
  city: string;
  country: string;
  totalCapacity: number;
  usedCapacity: number;
  contactPerson: string;
  phone: string;
  email: string;
  hasRefrigeration: boolean;
  hasHazardousStorage: boolean;
}

const mockData: WarehouseData[] = [
  {
    key: '1',
    id: '1',
    warehouseId: 'WH-001',
    name: 'РЦ "Москва-Центральный"',
    type: 'distribution_center',
    status: 'active',
    address: 'ул. Ленинградская, 15',
    city: 'Москва',
    country: 'Россия',
    totalCapacity: 50000,
    usedCapacity: 35000,
    contactPerson: 'Иванов А.П.',
    phone: '+7 (495) 123-45-67',
    email: 'moscow-rc@logistics.ru',
    hasRefrigeration: true,
    hasHazardousStorage: false,
  },
  {
    key: '2',
    id: '2',
    warehouseId: 'WH-002',
    name: 'Гипермаркет "МегаМолл"',
    type: 'hypermarket',
    status: 'active',
    address: 'Ленинградский пр., 80',
    city: 'Москва',
    country: 'Россия',
    totalCapacity: 5000,
    usedCapacity: 4200,
    contactPerson: 'Петрова Е.В.',
    phone: '+7 (495) 987-65-43',
    email: 'megamall@logistics.ru',
    hasRefrigeration: true,
    hasHazardousStorage: false,
  },
  {
    key: '3',
    id: '3',
    warehouseId: 'WH-003',
    name: 'Склад "Северный"',
    type: 'warehouse',
    status: 'active',
    address: 'Дмитровское ш., 100',
    city: 'Москва',
    country: 'Россия',
    totalCapacity: 15000,
    usedCapacity: 12000,
    contactPerson: 'Сидоров М.И.',
    phone: '+7 (495) 555-12-34',
    email: 'northern@logistics.ru',
    hasRefrigeration: false,
    hasHazardousStorage: true,
  },
];

const typeLabels = {
  distribution_center: 'Распределительный центр',
  hypermarket: 'Гипермаркет',
  warehouse: 'Склад',
  cross_dock: 'Кросс-док',
};

const statusColors = {
  active: 'green',
  inactive: 'orange',
  maintenance: 'blue',
  closed: 'red',
};

const statusLabels = {
  active: 'Активен',
  inactive: 'Неактивен',
  maintenance: 'Обслуживание',
  closed: 'Закрыт',
};

export default function WarehouseManagement() {
  const [data, setData] = useState<WarehouseData[]>(mockData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseData | null>(null);
  const [form] = Form.useForm();

  const getCapacityUtilization = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getCapacityStatus = (utilization: number) => {
    if (utilization >= 90) return 'exception';
    if (utilization >= 75) return 'active';
    return 'success';
  };

  const columns: ColumnsType<WarehouseData> = [
    {
      title: 'ID склада',
      dataIndex: 'warehouseId',
      key: 'warehouseId',
      sorter: (a, b) => a.warehouseId.localeCompare(b.warehouseId),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{typeLabels[type as keyof typeof typeLabels]}</Tag>
      ),
      filters: Object.entries(typeLabels).map(([value, label]) => ({ text: label, value })),
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
      title: 'Город',
      dataIndex: 'city',
      key: 'city',
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: 'Загрузка склада',
      key: 'capacity',
      render: (_, record) => {
        const utilization = getCapacityUtilization(record.usedCapacity, record.totalCapacity);
        const status = getCapacityStatus(utilization);
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              {record.usedCapacity.toLocaleString()} / {record.totalCapacity.toLocaleString()} м³
            </div>
            <Progress
              percent={utilization}
              size="small"
              status={status}
              format={(percent) => `${percent}%`}
            />
          </div>
        );
      },
    },
    {
      title: 'Особенности',
      key: 'features',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.hasRefrigeration && (
            <Tag color="cyan" icon={<DatabaseOutlined />}>Холодильник</Tag>
          )}
          {record.hasHazardousStorage && (
            <Tag color="red" icon={<DatabaseOutlined />}>Опасные грузы</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Контакты',
      key: 'contacts',
      render: (_, record) => (
        <div>
          <div>{record.contactPerson}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.phone}</div>
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
    setEditingWarehouse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (warehouse: WarehouseData) => {
    setEditingWarehouse(warehouse);
    form.setFieldsValue(warehouse);
    setIsModalVisible(true);
  };

  const handleDelete = (warehouse: WarehouseData) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: `Вы уверены, что хотите удалить склад "${warehouse.name}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        setData(data.filter(item => item.key !== warehouse.key));
        message.success('Склад успешно удален');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingWarehouse) {
        // Обновление существующего склада
        setData(data.map(item =>
          item.key === editingWarehouse.key ? { ...item, ...values } : item
        ));
        message.success('Склад успешно обновлен');
      } else {
        // Создание нового склада
        const newWarehouse: WarehouseData = {
          key: Date.now().toString(),
          id: Date.now().toString(),
          warehouseId: `WH-${String(data.length + 1).padStart(3, '0')}`,
          ...values,
        };
        setData([...data, newWarehouse]);
        message.success('Склад успешно создан');
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
            <h2>Управление складами и РЦ</h2>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Добавить склад
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
              `${range[0]}-${range[1]} из ${total} складов`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingWarehouse ? 'Редактировать склад' : 'Добавить склад'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingWarehouse ? 'Обновить' : 'Создать'}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            country: 'Россия',
            status: 'active',
            hasRefrigeration: false,
            hasHazardousStorage: false,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Название склада"
                rules={[{ required: true, message: 'Введите название склада' }]}
              >
                <Input placeholder="Введите название" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Тип склада"
                rules={[{ required: true, message: 'Выберите тип склада' }]}
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
            <Col span={12}>
              <Form.Item
                name="totalCapacity"
                label="Общая вместимость (м³)"
                rules={[{ required: true, message: 'Введите вместимость' }]}
              >
                <Input type="number" placeholder="Введите вместимость" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Адрес"
                rules={[{ required: true, message: 'Введите адрес' }]}
              >
                <Input placeholder="Введите адрес" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="Город"
                rules={[{ required: true, message: 'Введите город' }]}
              >
                <Input placeholder="Введите город" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="Контактное лицо"
                rules={[{ required: true, message: 'Введите контактное лицо' }]}
              >
                <Input placeholder="Введите ФИО" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Телефон"
                rules={[{ required: true, message: 'Введите телефон' }]}
              >
                <Input placeholder="Введите телефон" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Введите email' },
                  { type: 'email', message: 'Введите корректный email' }
                ]}
              >
                <Input placeholder="Введите email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="country"
                label="Страна"
                rules={[{ required: true, message: 'Введите страну' }]}
              >
                <Input placeholder="Введите страну" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hasRefrigeration"
                label="Холодильное оборудование"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>Да</Option>
                  <Option value={false}>Нет</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hasHazardousStorage"
                label="Хранение опасных грузов"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>Да</Option>
                  <Option value={false}>Нет</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
