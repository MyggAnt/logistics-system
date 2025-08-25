import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, DatePicker, Tag, message, Card, Row, Col, Progress, Tooltip, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, BarcodeOutlined, QrcodeOutlined, DatabaseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

interface ProductData {
  key: string;
  id: string;
  productId: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  barcode: string;
  qrCode: string;
  rfidTag: string;
  totalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  weight: number;
  volume: number;
  abcClassification: 'A' | 'B' | 'C';
  xyzClassification: 'X' | 'Y' | 'Z';
  isPerishable: boolean;
  shelfLifeDays: number;
  requiresRefrigeration: boolean;
  isHazardous: boolean;
  warehouseId: string;
  locationCode: string;
  unitCost: number;
  totalValue: number;
  lastUpdated: string;
}

const mockData: ProductData[] = [
  {
    key: '1',
    id: '1',
    productId: 'PRD-001',
    name: 'Молоко "Домик в деревне" 3.2%',
    category: 'Молочные продукты',
    brand: 'Домик в деревне',
    sku: 'MLK-001-3.2',
    barcode: '4601234567890',
    qrCode: 'QR-MLK-001',
    rfidTag: 'RFID-MLK-001',
    totalQuantity: 500,
    reservedQuantity: 50,
    availableQuantity: 450,
    minStockLevel: 100,
    maxStockLevel: 1000,
    weight: 0.93,
    volume: 0.001,
    abcClassification: 'A',
    xyzClassification: 'X',
    isPerishable: true,
    shelfLifeDays: 7,
    requiresRefrigeration: true,
    isHazardous: false,
    warehouseId: 'WH-001',
    locationCode: 'A-01-01-01',
    unitCost: 85.50,
    totalValue: 42750,
    lastUpdated: '2024-01-15',
  },
  {
    key: '2',
    id: '2',
    productId: 'PRD-002',
    name: 'Хлеб "Бородинский"',
    category: 'Хлебобулочные изделия',
    brand: 'Хлебозавод №1',
    sku: 'BRD-001-BRD',
    barcode: '4601234567891',
    qrCode: 'QR-BRD-001',
    rfidTag: 'RFID-BRD-001',
    totalQuantity: 200,
    reservedQuantity: 20,
    availableQuantity: 180,
    minStockLevel: 50,
    maxStockLevel: 300,
    weight: 0.5,
    volume: 0.002,
    abcClassification: 'A',
    xyzClassification: 'Y',
    isPerishable: true,
    shelfLifeDays: 3,
    requiresRefrigeration: false,
    isHazardous: false,
    warehouseId: 'WH-001',
    locationCode: 'A-02-01-01',
    unitCost: 45.00,
    totalValue: 9000,
    lastUpdated: '2024-01-15',
  },
  {
    key: '3',
    id: '3',
    productId: 'PRD-003',
    name: 'Батарейки AA "Энергия"',
    category: 'Электроника',
    brand: 'Энергия',
    sku: 'BAT-001-AA',
    barcode: '4601234567892',
    qrCode: 'QR-BAT-001',
    rfidTag: 'RFID-BAT-001',
    totalQuantity: 1000,
    reservedQuantity: 100,
    availableQuantity: 900,
    minStockLevel: 200,
    maxStockLevel: 1500,
    weight: 0.025,
    volume: 0.0001,
    abcClassification: 'B',
    xyzClassification: 'Z',
    isPerishable: false,
    shelfLifeDays: 1825,
    requiresRefrigeration: false,
    isHazardous: false,
    warehouseId: 'WH-001',
    locationCode: 'B-01-01-01',
    unitCost: 25.00,
    totalValue: 25000,
    lastUpdated: '2024-01-15',
  },
];

const abcColors = {
  A: 'red',
  B: 'orange',
  C: 'green',
};

const xyzColors = {
  X: 'purple',
  Y: 'blue',
  Z: 'cyan',
};

const getStockStatus = (available: number, min: number, max: number) => {
  if (available <= min) return 'error';
  if (available >= max * 0.9) return 'warning';
  return 'success';
};

const getStockStatusText = (available: number, min: number, max: number) => {
  if (available <= min) return 'Критически низкий';
  if (available >= max * 0.9) return 'Высокий';
  return 'Нормальный';
};

export default function ProductManagement() {
  const [data, setData] = useState<ProductData[]>(mockData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<ProductData> = [
    {
      title: 'ID товара',
      dataIndex: 'productId',
      key: 'productId',
      sorter: (a, b) => a.productId.localeCompare(b.productId),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            SKU: {record.sku}
          </div>
        </div>
      ),
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      filters: Array.from(new Set(data.map(item => item.category))).map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Бренд',
      dataIndex: 'brand',
      key: 'brand',
      filters: Array.from(new Set(data.map(item => item.brand))).map(brand => ({ text: brand, value: brand })),
      onFilter: (value, record) => record.brand === value,
    },
    {
      title: 'Коды',
      key: 'codes',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <BarcodeOutlined /> {record.barcode}
          </div>
          <div>
            <QrcodeOutlined /> {record.qrCode}
          </div>
          <div>
            <DatabaseOutlined /> {record.rfidTag}
          </div>
        </Space>
      ),
    },
    {
      title: 'Запасы',
      key: 'stock',
      render: (_, record) => {
        const stockStatus = getStockStatus(record.availableQuantity, record.minStockLevel, record.maxStockLevel);
        const stockStatusText = getStockStatusText(record.availableQuantity, record.minStockLevel, record.maxStockLevel);
        const utilization = Math.round((record.totalQuantity / record.maxStockLevel) * 100);
        
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              <Badge status={stockStatus} text={stockStatusText} />
            </div>
            <div style={{ fontSize: '12px', marginBottom: 4 }}>
              Доступно: {record.availableQuantity} / {record.totalQuantity}
            </div>
            <Progress
              percent={utilization}
              size="small"
              status={stockStatus === 'error' ? 'exception' : stockStatus === 'warning' ? 'active' : 'success'}
              format={(percent) => `${percent}%`}
            />
          </div>
        );
      },
    },
    {
      title: 'Классификация',
      key: 'classification',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={abcColors[record.abcClassification]}>
            ABC: {record.abcClassification}
          </Tag>
          <Tag color={xyzColors[record.xyzClassification]}>
            XYZ: {record.xyzClassification}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Особенности',
      key: 'features',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.isPerishable && (
            <Tag color="orange">Скоропортящийся</Tag>
          )}
          {record.requiresRefrigeration && (
            <Tag color="cyan">Холодильник</Tag>
          )}
          {record.isHazardous && (
            <Tag color="red">Опасный</Tag>
          )}
          {record.shelfLifeDays < 30 && (
            <Tag color="red">{record.shelfLifeDays} дн.</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Расположение',
      key: 'location',
      render: (_, record) => (
        <div>
          <div>Склад: {record.warehouseId}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Место: {record.locationCode}
          </div>
        </div>
      ),
    },
    {
      title: 'Стоимость',
      key: 'cost',
      render: (_, record) => (
        <div>
          <div>Цена: {record.unitCost} ₽</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Общая: {record.totalValue.toLocaleString()} ₽
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
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product: ProductData) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (product: ProductData) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: `Вы уверены, что хотите удалить товар "${product.name}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: () => {
        setData(data.filter(item => item.key !== product.key));
        message.success('Товар успешно удален');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        // Обновление существующего товара
        setData(data.map(item =>
          item.key === editingProduct.key ? { ...item, ...values } : item
        ));
        message.success('Товар успешно обновлен');
      } else {
        // Создание нового товара
        const newProduct: ProductData = {
          key: Date.now().toString(),
          id: Date.now().toString(),
          productId: `PRD-${String(data.length + 1).padStart(3, '0')}`,
          ...values,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        setData([...data, newProduct]);
        message.success('Товар успешно создан');
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
            <h2>Управление товарами и запасами</h2>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Добавить товар
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
              `${range[0]}-${range[1]} из ${total} товаров`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title={editingProduct ? 'Редактировать товар' : 'Добавить товар'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1000}
        okText={editingProduct ? 'Обновить' : 'Создать'}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            abcClassification: 'C',
            xyzClassification: 'Z',
            isPerishable: false,
            requiresRefrigeration: false,
            isHazardous: false,
            shelfLifeDays: 365,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Название товара"
                rules={[{ required: true, message: 'Введите название товара' }]}
              >
                <Input placeholder="Введите название" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Категория"
                rules={[{ required: true, message: 'Выберите категорию' }]}
              >
                <Input placeholder="Введите категорию" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="brand"
                label="Бренд"
                rules={[{ required: true, message: 'Введите бренд' }]}
              >
                <Input placeholder="Введите бренд" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[{ required: true, message: 'Введите SKU' }]}
              >
                <Input placeholder="Введите SKU" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="barcode"
                label="Штрихкод"
                rules={[{ required: true, message: 'Введите штрихкод' }]}
              >
                <Input placeholder="Введите штрихкод" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="qrCode"
                label="QR-код"
              >
                <Input placeholder="Введите QR-код" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="rfidTag"
                label="RFID тег"
              >
                <Input placeholder="Введите RFID тег" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="totalQuantity"
                label="Общее количество"
                rules={[{ required: true, message: 'Введите количество' }]}
              >
                <Input type="number" placeholder="Введите количество" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="minStockLevel"
                label="Минимальный запас"
                rules={[{ required: true, message: 'Введите минимальный запас' }]}
              >
                <Input type="number" placeholder="Введите запас" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxStockLevel"
                label="Максимальный запас"
                rules={[{ required: true, message: 'Введите максимальный запас' }]}
              >
                <Input type="number" placeholder="Введите запас" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="weight"
                label="Вес (кг)"
                rules={[{ required: true, message: 'Введите вес' }]}
              >
                <Input type="number" step="0.01" placeholder="Введите вес" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="volume"
                label="Объем (м³)"
                rules={[{ required: true, message: 'Введите объем' }]}
              >
                <Input type="number" step="0.001" placeholder="Введите объем" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unitCost"
                label="Цена за единицу (₽)"
                rules={[{ required: true, message: 'Введите цену' }]}
              >
                <Input type="number" step="0.01" placeholder="Введите цену" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="abcClassification"
                label="ABC классификация"
                rules={[{ required: true, message: 'Выберите классификацию' }]}
              >
                <Select>
                  <Option value="A">A - Высокий приоритет</Option>
                  <Option value="B">B - Средний приоритет</Option>
                  <Option value="C">C - Низкий приоритет</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="xyzClassification"
                label="XYZ классификация"
                rules={[{ required: true, message: 'Выберите классификацию' }]}
              >
                <Select>
                  <Option value="X">X - Стабильный спрос</Option>
                  <Option value="Y">Y - Переменный спрос</Option>
                  <Option value="Z">Z - Нестабильный спрос</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="shelfLifeDays"
                label="Срок годности (дни)"
                rules={[{ required: true, message: 'Введите срок годности' }]}
              >
                <Input type="number" placeholder="Введите дни" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="isPerishable"
                label="Скоропортящийся"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>Да</Option>
                  <Option value={false}>Нет</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="requiresRefrigeration"
                label="Требует охлаждения"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>Да</Option>
                  <Option value={false}>Нет</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="isHazardous"
                label="Опасный груз"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>Да</Option>
                  <Option value={false}>Нет</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
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
                name="locationCode"
                label="Код места хранения"
                rules={[{ required: true, message: 'Введите код места' }]}
              >
                <Input placeholder="Например: A-01-01-01" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reservedQuantity"
                label="Зарезервировано"
                rules={[{ required: true, message: 'Введите количество' }]}
              >
                <Input type="number" placeholder="Введите количество" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
