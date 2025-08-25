import React from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { Typography, Card, Form, Input, Select, DatePicker, Button, Row, Col, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function NewOrderPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('New order values:', values);
    // Here you would typically send the data to your backend
    router.push('/admin/orders');
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          style={{ marginBottom: 16 }}
        >
          Назад к заказам
        </Button>
        <Title level={2}>Создание нового заказа</Title>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            orderType: 'retail',
            channel: 'hypermarket',
            customerType: 'business',
            status: 'draft',
            priority: 'medium',
            currency: 'RUB'
          }}
        >
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="customerName"
                label="Название клиента"
                rules={[{ required: true, message: 'Введите название клиента' }]}
              >
                <Input placeholder="ООО Компания" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="customerType"
                label="Тип клиента"
                rules={[{ required: true, message: 'Выберите тип клиента' }]}
              >
                <Select>
                  <Option value="business">Бизнес</Option>
                  <Option value="individual">Физическое лицо</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="orderType"
                label="Тип заказа"
                rules={[{ required: true, message: 'Выберите тип заказа' }]}
              >
                <Select>
                  <Option value="internal">Внутренний</Option>
                  <Option value="retail">Розничный</Option>
                  <Option value="ecommerce">E-commerce</Option>
                  <Option value="procurement">Закупочный</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="channel"
                label="Канал заказа"
                rules={[{ required: true, message: 'Выберите канал заказа' }]}
              >
                <Select>
                  <Option value="distribution_center">Распределительный центр</Option>
                  <Option value="hypermarket">Гипермаркет</Option>
                  <Option value="online_store">Интернет-магазин</Option>
                  <Option value="external_supplier">Внешний поставщик</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="sourceLocation"
                label="Место отправления"
                rules={[{ required: true, message: 'Введите место отправления' }]}
              >
                <Input placeholder="Склад №1, Москва" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="destination"
                label="Место назначения"
                rules={[{ required: true, message: 'Введите место назначения' }]}
              >
                <Input placeholder="Гипермаркет №5, Санкт-Петербург" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={8}>
              <Form.Item
                name="priority"
                label="Приоритет"
                rules={[{ required: true, message: 'Выберите приоритет' }]}
              >
                <Select>
                  <Option value="low">Низкий</Option>
                  <Option value="medium">Средний</Option>
                  <Option value="high">Высокий</Option>
                  <Option value="urgent">Срочный</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item
                name="estimatedDelivery"
                label="Планируемая дата доставки"
                rules={[{ required: true, message: 'Выберите дату доставки' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item
                name="currency"
                label="Валюта"
                rules={[{ required: true, message: 'Выберите валюту' }]}
              >
                <Select>
                  <Option value="RUB">Рубль (₽)</Option>
                  <Option value="USD">Доллар ($)</Option>
                  <Option value="EUR">Евро (€)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Примечания"
          >
            <TextArea rows={4} placeholder="Дополнительная информация о заказе..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Создать заказ
              </Button>
              <Button onClick={() => router.back()}>
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </AdminLayout>
  );
}
