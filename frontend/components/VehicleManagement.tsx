import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, DatePicker, Tag, message, Card, Row, Col, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, CarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface VehicleData {
  key: string;
  id: string;
  plateNumber: string;
  model: string;
  capacity: number;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_service';
  driverName?: string;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelLevel: number;
  mileage: number;
}

const mockData: VehicleData[] = [
  {
    key: '1',
    id: 'VEH-001',
    plateNumber: 'А123БВ77',
    model: 'Газель Next',
    capacity: 1500,
    status: 'in_use',
    driverName: 'Иванов И.И.',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10',
    fuelLevel: 75,
    mileage: 45000,
  },
  {
    key: '2',
    id: 'VEH-002',
    plateNumber: 'В456ГД77',
    model: 'Ford Transit',
    capacity: 2000,
    status: 'available',
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-02-05',
    fuelLevel: 90,
    mileage: 32000,
  },
  {
    key: '3',
    id: 'VEH-003',
    plateNumber: 'Е789ЖЗ77',
    model: 'Mercedes Sprinter',
    capacity: 3000,
    status: 'maintenance',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-02-15',
    fuelLevel: 25,
    mileage: 78000,
  },
];

const statusColors = {
  available: 'green',
  in_use: 'blue',
  maintenance: 'orange',
  out_of_service: 'red',
};

export default function VehicleManagement() {
  const [data, setData] = useState<VehicleData[]>(mockData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<VehicleData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Номер',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      sorter: (a, b) => a.plateNumber.localeCompare(b.plateNumber),
    },
    {
      title: 'Модель',
      dataIndex: 'model',
      key: 'model',
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: 'Грузоподъемность (кг)',
      dataIndex: 'capacity',
      key: 'capacity',
      sorter: (a, b) => a.capacity - b.capacity,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {status === 'available' && 'Доступен'}
          {status === 'in_use' && 'В использовании'}
          {status === 'maintenance' && 'На обслуживании'}
          {status === 'out_of_service' && 'Неисправен'}
        </Tag>
      ),
      filters: [
        { text: 'Доступен', value: 'available' },
        { text: 'В использовании', value: 'in_use' },
        { text: 'На обслуживании', value: 'maintenance' },
        { text: 'Неисправен', value: 'out_of_service' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Водитель',
      dataIndex: 'driverName',
      key: 'driverName',
      render: (driverName: string) => driverName || '-',
    },
    {
      title: 'Уровень топлива',
      dataIndex: 'fuelLevel',
      key: 'fuelLevel',
      render: (fuelLevel: number) => (
        <Progress
          percent={fuelLevel}
          size="small"
          status={fuelLevel < 20 ? 'exception' : fuelLevel < 50 ? 'active' : 'success'}
        />
      ),
    },
    {
      title: 'Пробег (км)',
      dataIndex: 'mileage',
      key: 'mileage',
      sorter: (a, b) => a.mileage - b.mileage,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
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
            onClick={() => handleDelete(record.key)}
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: VehicleData) => {
    setEditingVehicle(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setData(data.filter(item => item.key !== key));
    message.success('Транспортное средство удалено');
  };

  const handleAdd = () => {
    setEditingVehicle(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingVehicle) {
        setData(data.map(item => 
          item.key === editingVehicle.key ? { ...item, ...values } : item
        ));
        message.success('Транспортное средство обновлено');
      } else {
        const newVehicle: VehicleData = {
          key: Date.now().toString(),
          id: `VEH-${String(data.length + 1).padStart(3, '0')}`,
          ...values,
          lastMaintenance: new Date().toISOString().split('T')[0],
          fuelLevel: 100,
          mileage: 0,
        };
        setData([...data, newVehicle]);
        message.success('Транспортное средство добавлено');
      }
      setIsModalVisible(false);
    });
  };

  const handleSearch = (value: string) => {
    if (!value) {
      setData(mockData);
      return;
    }
    const filtered = mockData.filter(
      item =>
        item.plateNumber.toLowerCase().includes(value.toLowerCase()) ||
        item.model.toLowerCase().includes(value.toLowerCase()) ||
        item.id.toLowerCase().includes(value.toLowerCase())
    );
    setData(filtered);
  };

  const getStatusStats = () => {
    const stats = {
      available: data.filter(v => v.status === 'available').length,
      in_use: data.filter(v => v.status === 'in_use').length,
      maintenance: data.filter(v => v.status === 'maintenance').length,
      out_of_service: data.filter(v => v.status === 'out_of_service').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <CarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{data.length}</div>
                <div>Всего ТС</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>{stats.available}</div>
              <div>Доступно</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>{stats.in_use}</div>
              <div>В использовании</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>{stats.maintenance}</div>
              <div>На обслуживании</div>
            </div>
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="Поиск по номеру, модели или ID"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: 400 }}
          onSearch={handleSearch}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleAdd}
        >
          Добавить ТС
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} из ${total} транспортных средств`,
        }}
      />

      <Modal
        title={editingVehicle ? 'Редактировать ТС' : 'Добавить ТС'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="plateNumber"
            label="Гос. номер"
            rules={[{ required: true, message: 'Пожалуйста, введите гос. номер' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="model"
            label="Модель"
            rules={[{ required: true, message: 'Пожалуйста, введите модель' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Грузоподъемность (кг)"
            rules={[{ required: true, message: 'Пожалуйста, введите грузоподъемность' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Статус"
            rules={[{ required: true, message: 'Пожалуйста, выберите статус' }]}
          >
            <Select>
              <Option value="available">Доступен</Option>
              <Option value="in_use">В использовании</Option>
              <Option value="maintenance">На обслуживании</Option>
              <Option value="out_of_service">Неисправен</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="driverName"
            label="Водитель"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nextMaintenance"
            label="Следующее ТО"
            rules={[{ required: true, message: 'Пожалуйста, выберите дату ТО' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
