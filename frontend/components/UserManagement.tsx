import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, DatePicker, Tag, message, Card, Row, Col, Progress, Tooltip, Badge, Tabs, Switch, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, SafetyOutlined, KeyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface UserData {
  key: string;
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'locked';
  lastLoginDate?: string;
  lastActivity?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  roles: string[];
  accessibleWarehouses: string[];
  createdAt: string;
}

interface RoleData {
  key: string;
  id: string;
  name: string;
  description: string;
  type: 'system' | 'custom';
  isActive: boolean;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

interface PermissionData {
  key: string;
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  effect: 'allow' | 'deny';
  conditions: string;
  isActive: boolean;
}

const mockUsers: UserData[] = [
  {
    key: '1',
    id: '1',
    username: 'admin',
    email: 'admin@logistics.ru',
    firstName: 'Администратор',
    lastName: 'Системы',
    phone: '+7 (495) 123-45-67',
    status: 'active',
    lastLoginDate: '2024-01-15 10:30',
    lastActivity: '2024-01-15 15:45',
    isEmailVerified: true,
    isPhoneVerified: true,
    roles: ['admin', 'manager'],
    accessibleWarehouses: ['WH-001', 'WH-002', 'WH-003'],
    createdAt: '2024-01-01',
  },
  {
    key: '2',
    id: '2',
    username: 'ivanov',
    email: 'ivanov@logistics.ru',
    firstName: 'Иван',
    lastName: 'Иванов',
    middleName: 'Иванович',
    phone: '+7 (495) 234-56-78',
    status: 'active',
    lastLoginDate: '2024-01-15 09:15',
    lastActivity: '2024-01-15 14:20',
    isEmailVerified: true,
    isPhoneVerified: true,
    roles: ['warehouse_manager'],
    accessibleWarehouses: ['WH-001'],
    createdAt: '2024-01-02',
  },
  {
    key: '3',
    id: '3',
    username: 'petrova',
    email: 'petrova@logistics.ru',
    firstName: 'Елена',
    lastName: 'Петрова',
    phone: '+7 (495) 345-67-89',
    status: 'active',
    lastLoginDate: '2024-01-15 08:45',
    lastActivity: '2024-01-15 13:30',
    isEmailVerified: true,
    isPhoneVerified: false,
    roles: ['driver', 'operator'],
    accessibleWarehouses: ['WH-001', 'WH-002'],
    createdAt: '2024-01-03',
  },
];

const mockRoles: RoleData[] = [
  {
    key: '1',
    id: '1',
    name: 'admin',
    description: 'Полный доступ к системе',
    type: 'system',
    isActive: true,
    permissions: ['all'],
    userCount: 1,
    createdAt: '2024-01-01',
  },
  {
    key: '2',
    id: '2',
    name: 'warehouse_manager',
    description: 'Управление складскими операциями',
    type: 'custom',
    isActive: true,
    permissions: ['warehouse_read', 'warehouse_write', 'inventory_manage'],
    userCount: 2,
    createdAt: '2024-01-02',
  },
  {
    key: '3',
    id: '3',
    name: 'driver',
    description: 'Управление транспортом и маршрутами',
    type: 'custom',
    isActive: true,
    permissions: ['transport_read', 'route_read', 'route_write'],
    userCount: 3,
    createdAt: '2024-01-03',
  },
  {
    key: '4',
    id: '4',
    name: 'operator',
    description: 'Базовые операции с заказами',
    type: 'custom',
    isActive: true,
    permissions: ['order_read', 'order_write'],
    userCount: 5,
    createdAt: '2024-01-04',
  },
];

const mockPermissions: PermissionData[] = [
  {
    key: '1',
    id: '1',
    name: 'warehouse_read',
    description: 'Чтение информации о складах',
    resource: 'warehouse',
    action: 'read',
    effect: 'allow',
    conditions: '',
    isActive: true,
  },
  {
    key: '2',
    id: '2',
    name: 'warehouse_write',
    description: 'Создание и редактирование складов',
    resource: 'warehouse',
    action: 'create',
    effect: 'allow',
    conditions: '',
    isActive: true,
  },
  {
    key: '3',
    id: '3',
    name: 'inventory_manage',
    description: 'Управление запасами',
    resource: 'inventory',
    action: 'update',
    effect: 'allow',
    conditions: '',
    isActive: true,
  },
  {
    key: '4',
    id: '4',
    name: 'transport_read',
    description: 'Чтение информации о транспорте',
    resource: 'transport',
    action: 'read',
    effect: 'allow',
    conditions: '',
    isActive: true,
  },
];

const statusColors = {
  active: 'green',
  inactive: 'orange',
  suspended: 'red',
  locked: 'gray',
};

const statusLabels = {
  active: 'Активен',
  inactive: 'Неактивен',
  suspended: 'Приостановлен',
  locked: 'Заблокирован',
};

const roleTypeColors = {
  system: 'blue',
  custom: 'green',
};

const roleTypeLabels = {
  system: 'Системная',
  custom: 'Пользовательская',
};

const actionColors = {
  create: 'green',
  read: 'blue',
  update: 'orange',
  delete: 'red',
};

const actionLabels = {
  create: 'Создание',
  read: 'Чтение',
  update: 'Редактирование',
  delete: 'Удаление',
};

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div>
      <Card>
        <h2>Управление пользователями и безопасностью</h2>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Пользователи" key="users">
            <UserTable />
          </TabPane>
          <TabPane tab="Роли" key="roles">
            <RoleTable />
          </TabPane>
          <TabPane tab="Права доступа" key="permissions">
            <PermissionTable />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

function UserTable() {
  const [data, setData] = useState<UserData[]>(mockUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<UserData> = [
    {
      title: 'Пользователь',
      key: 'user',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>
            {record.firstName} {record.lastName}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            @{record.username}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.email}
          </div>
        </div>
      ),
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
      title: 'Роли',
      key: 'roles',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.roles.map(role => (
            <Tag key={role} color="blue">{role}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Доступные склады',
      key: 'warehouses',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.accessibleWarehouses.map(warehouse => (
            <Tag key={warehouse} color="green">{warehouse}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Активность',
      key: 'activity',
      render: (_, record) => (
        <div>
          {record.lastLoginDate && (
            <div>Вход: {record.lastLoginDate}</div>
          )}
          {record.lastActivity && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              Активность: {record.lastActivity}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Верификация',
      key: 'verification',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={record.isEmailVerified ? 'green' : 'red'}>
            Email {record.isEmailVerified ? '✓' : '✗'}
          </Tag>
          <Tag color={record.isPhoneVerified ? 'green' : 'red'}>
            Телефон {record.isPhoneVerified ? '✓' : '✗'}
          </Tag>
        </Space>
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
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (user: UserData) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: `Вы уверены, что хотите удалить пользователя "${user.username}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        setData(data.filter(item => item.key !== user.key));
        message.success('Пользователь успешно удален');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        setData(data.map(item =>
          item.key === editingUser.key ? { ...item, ...values } : item
        ));
        message.success('Пользователь успешно обновлен');
      } else {
        const newUser: UserData = {
          key: Date.now().toString(),
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
          ...values,
        };
        setData([...data, newUser]);
        message.success('Пользователь успешно создан');
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
          <h3>Управление пользователями</h3>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Добавить пользователя
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
            `${range[0]}-${range[1]} из ${total} пользователей`,
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingUser ? 'Обновить' : 'Создать'}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            isEmailVerified: false,
            isPhoneVerified: false,
            roles: [],
            accessibleWarehouses: [],
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="username"
                label="Имя пользователя"
                rules={[{ required: true, message: 'Введите имя пользователя' }]}
              >
                <Input placeholder="Введите имя пользователя" />
              </Form.Item>
            </Col>
            <Col span={8}>
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
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                name="firstName"
                label="Имя"
                rules={[{ required: true, message: 'Введите имя' }]}
              >
                <Input placeholder="Введите имя" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="lastName"
                label="Фамилия"
                rules={[{ required: true, message: 'Введите фамилию' }]}
              >
                <Input placeholder="Введите фамилию" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="middleName"
                label="Отчество"
              >
                <Input placeholder="Введите отчество" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                name="roles"
                label="Роли"
                rules={[{ required: true, message: 'Выберите роли' }]}
              >
                <Select mode="multiple" placeholder="Выберите роли">
                  {mockRoles.map(role => (
                    <Option key={role.name} value={role.name}>{role.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="accessibleWarehouses"
                label="Доступные склады"
              >
                <Select mode="multiple" placeholder="Выберите склады">
                  <Option value="WH-001">WH-001</Option>
                  <Option value="WH-002">WH-002</Option>
                  <Option value="WH-003">WH-003</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isEmailVerified"
                label="Email верифицирован"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isPhoneVerified"
                label="Телефон верифицирован"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

function RoleTable() {
  const [data, setData] = useState<RoleData[]>(mockRoles);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<RoleData> = [
    {
      title: 'Название роли',
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
        <Tag color={roleTypeColors[type as keyof typeof roleTypeColors]}>
          {roleTypeLabels[type as keyof typeof roleTypeLabels]}
        </Tag>
      ),
      filters: Object.entries(roleTypeLabels).map(([value, label]) => ({ text: label, value })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Активна' : 'Неактивна'}
        </Tag>
      ),
    },
    {
      title: 'Права доступа',
      key: 'permissions',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.permissions.map(permission => (
            <Tag key={permission} color="blue">{permission}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Пользователи',
      key: 'userCount',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.userCount}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            пользователей
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
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (role: RoleData) => {
    setEditingRole(role);
    form.setFieldsValue(role);
    setIsModalVisible(true);
  };

  const handleDelete = (role: RoleData) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: `Вы уверены, что хотите удалить роль "${role.name}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        setData(data.filter(item => item.key !== role.key));
        message.success('Роль успешно удалена');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        setData(data.map(item =>
          item.key === editingRole.key ? { ...item, ...values } : item
        ));
        message.success('Роль успешно обновлена');
      } else {
        const newRole: RoleData = {
          key: Date.now().toString(),
          id: Date.now().toString(),
          userCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          ...values,
        };
        setData([...data, newRole]);
        message.success('Роль успешно создана');
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
          <h3>Управление ролями</h3>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Добавить роль
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
            `${range[0]}-${range[1]} из ${total} ролей`,
        }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingRole ? 'Редактировать роль' : 'Добавить роль'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText={editingRole ? 'Обновить' : 'Создать'}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'custom',
            isActive: true,
            permissions: [],
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Название роли"
                rules={[{ required: true, message: 'Введите название' }]}
              >
                <Input placeholder="Введите название" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Тип роли"
                rules={[{ required: true, message: 'Выберите тип' }]}
              >
                <Select placeholder="Выберите тип">
                  {Object.entries(roleTypeLabels).map(([value, label]) => (
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
                rules={[{ required: true, message: 'Введите описание' }]}
              >
                <TextArea rows={2} placeholder="Введите описание роли" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="permissions"
                label="Права доступа"
                rules={[{ required: true, message: 'Выберите права' }]}
              >
                <Select mode="multiple" placeholder="Выберите права">
                  {mockPermissions.map(permission => (
                    <Option key={permission.name} value={permission.name}>
                      {permission.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Активна"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

function PermissionTable() {
  const [data, setData] = useState<PermissionData[]>(mockPermissions);

  const columns: ColumnsType<PermissionData> = [
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
      title: 'Ресурс',
      dataIndex: 'resource',
      key: 'resource',
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: 'Действие',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Tag color={actionColors[action as keyof typeof actionColors]}>
          {actionLabels[action as keyof typeof actionLabels]}
        </Tag>
      ),
    },
    {
      title: 'Эффект',
      dataIndex: 'effect',
      key: 'effect',
      render: (effect: string) => (
        <Tag color={effect === 'allow' ? 'green' : 'red'}>
          {effect === 'allow' ? 'Разрешить' : 'Запретить'}
        </Tag>
      ),
    },
    {
      title: 'Условия',
      dataIndex: 'conditions',
      key: 'conditions',
      render: (text) => (
        <div>
          {text || 'Нет условий'}
        </div>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Активно' : 'Неактивно'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h3>Права доступа</h3>
        </Col>
        <Col>
          <Text style={{ color: '#666' }}>
            Система прав доступа управляется администратором
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
            `${range[0]}-${range[1]} из ${total} прав`,
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}
