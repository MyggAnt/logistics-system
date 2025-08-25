import React from "react";
import { Card, Col, Row, Button, Typography } from "antd";
import {
  SettingOutlined,
  CloudSyncOutlined,
  ShoppingCartOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const integrations = [
  {
    title: "ERP системы",
    icon: <ApartmentOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
    services: [
      {
        name: "Microsoft Dynamics AX (Axapta)",
        description: "Интеграция с ERP Axapta для обмена данными о заказах и складах",
      },
      {
        name: "1С:Предприятие",
        description: "Интеграция с 1С для бухгалтерии, склада и документооборота",
      },
    ],
  },
  {
    title: "E-commerce",
    icon: <ShoppingCartOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
    services: [
      {
        name: "Ozon",
        description: "Загрузка и синхронизация заказов с Ozon API",
      },
      {
        name: "Wildberries",
        description: "Интеграция заказов и остатков с Wildberries",
      },
      {
        name: "Shopify",
        description: "Синхронизация заказов и товаров с Shopify",
      },
    ],
  },
  {
    title: "Таможня",
    icon: <CloudSyncOutlined style={{ fontSize: 32, color: "#faad14" }} />,
    services: [
      {
        name: "ФТС РФ API",
        description: "Выгрузка деклараций и обмен с Федеральной Таможенной Службой",
      },
      {
        name: "Международные таможенные API",
        description: "Поддержка API для международных грузоперевозок",
      },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Интеграции</Title>
      <Paragraph>
        Подключите внешние системы для автоматизации обмена данными.
      </Paragraph>

      <Row gutter={[16, 16]}>
        {integrations.map((category, idx) => (
          <Col span={24} key={idx}>
            <Card
              title={
                <span>
                  {category.icon} <b>{category.title}</b>
                </span>
              }
              bordered
            >
              <Row gutter={[16, 16]}>
                {category.services.map((service, i) => (
                  <Col span={8} key={i}>
                    <Card hoverable>
                      <Title level={4}>{service.name}</Title>
                      <Paragraph>{service.description}</Paragraph>
                      <Button type="primary" icon={<SettingOutlined />}>
                        Настроить
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

