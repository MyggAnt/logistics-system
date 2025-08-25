import React, { useState, useEffect } from 'react';
import { List, Badge, Button, Popover, Typography, Tag, Space, Divider, Empty } from 'antd';
import { 
  BellOutlined, 
  ExclamationCircleOutlined, 
  CheckCircleOutlined, 
  InfoCircleOutlined,
  WarningOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    text: string;
    onClick: () => void;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Низкий уровень топлива',
    message: 'Транспортное средство В456ГД77 имеет уровень топлива менее 20%',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    action: {
      text: 'Просмотреть ТС',
      onClick: () => console.log('View vehicle'),
    },
  },
  {
    id: '2',
    type: 'success',
    title: 'Заказ доставлен',
    message: 'Заказ ORD-003 успешно доставлен клиенту ООО "ТехноМир"',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Новый заказ',
    message: 'Получен новый заказ ORD-004 от клиента ИП Петров',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
  },
  {
    id: '4',
    type: 'error',
    title: 'Проблема с маршрутом',
    message: 'Обнаружена проблема с маршрутом для заказа ORD-002',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: false,
    action: {
      text: 'Исправить маршрут',
      onClick: () => console.log('Fix route'),
    },
  },
  {
    id: '5',
    type: 'warning',
    title: 'Требуется обслуживание',
    message: 'Транспортное средство Е789ЖЗ77 требует планового обслуживания',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: true,
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    case 'warning':
      return <WarningOutlined style={{ color: '#faad14' }} />;
    case 'error':
      return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
    case 'info':
    default:
      return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return '#52c41a';
    case 'warning':
      return '#faad14';
    case 'error':
      return '#ff4d4f';
    case 'info':
    default:
      return '#1890ff';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин назад`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ч назад`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} дн назад`;
  }
};

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [visible, setVisible] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleActionClick = (notification: Notification) => {
    if (notification.action) {
      notification.action.onClick();
      handleMarkAsRead(notification.id);
    }
  };

  const notificationContent = (
    <div style={{ width: 350, maxHeight: 400, overflowY: 'auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '8px 16px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Text strong>Уведомления</Text>
        {unreadCount > 0 && (
          <Button 
            type="link" 
            size="small" 
            onClick={handleMarkAllAsRead}
          >
            Отметить все как прочитанные
          </Button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <Empty 
          description="Нет уведомлений" 
          style={{ padding: '40px 20px' }}
        />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              style={{
                padding: '12px 16px',
                backgroundColor: notification.read ? 'transparent' : '#f6ffed',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
              }}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <List.Item.Meta
                avatar={getNotificationIcon(notification.type)}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ color: notification.read ? '#666' : '#000' }}>
                      {notification.title}
                    </Text>
                    <Space>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatTimeAgo(notification.timestamp)}
                      </Text>
                      <Button
                        type="text"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                      />
                    </Space>
                  </div>
                }
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                      {notification.message}
                    </Text>
                    {notification.action && (
                      <div style={{ marginTop: 8 }}>
                        <Button
                          type="link"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(notification);
                          }}
                        >
                          {notification.action.text}
                        </Button>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      title={null}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottomRight"
      overlayStyle={{ width: 350 }}
    >
      <Badge count={unreadCount} offset={[-5, 5]}>
        <Button
          type="text"
          icon={<BellOutlined />}
          size="large"
          style={{ fontSize: '18px' }}
        />
      </Badge>
    </Popover>
  );
}
