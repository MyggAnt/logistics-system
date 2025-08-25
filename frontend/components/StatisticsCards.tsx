import React from 'react';
import { Card, Row, Col, Statistic, Progress, Tooltip } from 'antd';
import { 
  ShoppingCartOutlined, 
  CarOutlined, 
  UserOutlined, 
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

interface StatisticsCardsProps {
  ordersData?: {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
  vehiclesData?: {
    total: number;
    available: number;
    inUse: number;
    maintenance: number;
    outOfService: number;
  };
  revenueData?: {
    current: number;
    previous: number;
    growth: number;
  };
}

const defaultOrdersData = {
  total: 156,
  pending: 23,
  inTransit: 45,
  delivered: 85,
  cancelled: 3,
};

const defaultVehiclesData = {
  total: 12,
  available: 5,
  inUse: 4,
  maintenance: 2,
  outOfService: 1,
};

const defaultRevenueData = {
  current: 1250000,
  previous: 1100000,
  growth: 13.6,
};

export default function StatisticsCards({ 
  ordersData = defaultOrdersData, 
  vehiclesData = defaultVehiclesData,
  revenueData = defaultRevenueData 
}: StatisticsCardsProps) {
  const getOrderCompletionRate = () => {
    return Math.round((ordersData.delivered / ordersData.total) * 100);
  };

  const getVehicleUtilizationRate = () => {
    return Math.round(((vehiclesData.inUse + vehiclesData.maintenance) / vehiclesData.total) * 100);
  };

  const getRevenueGrowthColor = () => {
    return revenueData.growth >= 0 ? '#52c41a' : '#ff4d4f';
  };

  return (
    <Row gutter={[16, 16]}>
      {/* Orders Statistics */}
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Всего заказов"
            value={ordersData.total}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <div style={{ marginTop: 8 }}>
            <Progress
              percent={getOrderCompletionRate()}
              size="small"
              status="active"
              format={(percent) => `${percent}% выполнено`}
            />
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Активные заказы"
            value={ordersData.pending + ordersData.inTransit}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {ordersData.pending} ожидают • {ordersData.inTransit} в пути
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Доставлено"
            value={ordersData.delivered}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {getOrderCompletionRate()}% от общего числа
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Отменено"
            value={ordersData.cancelled}
            prefix={<ExclamationCircleOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {Math.round((ordersData.cancelled / ordersData.total) * 100)}% от общего числа
          </div>
        </Card>
      </Col>

      {/* Vehicle Statistics */}
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Транспортные средства"
            value={vehiclesData.total}
            prefix={<CarOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <div style={{ marginTop: 8 }}>
            <Progress
              percent={getVehicleUtilizationRate()}
              size="small"
              status="active"
              format={(percent) => `${percent}% загружено`}
            />
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Доступно ТС"
            value={vehiclesData.available}
            prefix={<CarOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {Math.round((vehiclesData.available / vehiclesData.total) * 100)}% от общего числа
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="В использовании"
            value={vehiclesData.inUse}
            prefix={<CarOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {Math.round((vehiclesData.inUse / vehiclesData.total) * 100)}% от общего числа
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="На обслуживании"
            value={vehiclesData.maintenance}
            prefix={<CarOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {Math.round((vehiclesData.maintenance / vehiclesData.total) * 100)}% от общего числа
          </div>
        </Card>
      </Col>

      {/* Revenue Statistics */}
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Доход (текущий месяц)"
            value={revenueData.current}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#52c41a' }}
            formatter={(value) => `${(value as number / 1000).toFixed(0)}K ₽`}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: getRevenueGrowthColor() }}>
            {revenueData.growth >= 0 ? '+' : ''}{revenueData.growth}% vs прошлый месяц
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Средний чек"
            value={ordersData.total > 0 ? Math.round(revenueData.current / ordersData.total) : 0}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#1890ff' }}
            formatter={(value) => `${value} ₽`}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            За {ordersData.total} заказов
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Эффективность доставки"
            value={getOrderCompletionRate()}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
            suffix="%"
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {ordersData.delivered} из {ordersData.total} заказов
          </div>
        </Card>
      </Col>
    </Row>
  );
}
