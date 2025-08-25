import { Layout, Menu, theme as antdTheme } from 'antd';
import { 
  BarChartOutlined, 
  GlobalOutlined, 
  ShoppingCartOutlined, 
  CarOutlined,
  HomeOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  BarcodeOutlined,
  ReloadOutlined,
  DashboardOutlined,
  TeamOutlined,
  SafetyOutlined,
  CloudOutlined,
  CloudSyncOutlined,
  DollarOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import NotificationSystem from './NotificationSystem';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useLayoutEvents } from '../context/LayoutEvents';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = router?.pathname || '';
  const { token } = antdTheme.useToken();
  const { isDark } = useTheme();
  const { bump } = useLayoutEvents();

  const routeMappings: Array<[string, string, string | undefined]> = [
    ['/admin/orders/new', '3', 'orders'],
    ['/admin/orders/batches', '4', 'orders'],
    ['/admin/orders', '2', 'orders'],
    ['/admin/warehouses', '5', 'warehouse'],
    ['/admin/inventory', '6', 'warehouse'],
    ['/admin/picking', '7', 'warehouse'],
    ['/admin/products', '8', 'warehouse'],
    ['/admin/locations', '9', 'warehouse'],
    ['/admin/vehicles', '10', 'transport'],
    ['/admin/routes', '11', 'transport'],
    ['/admin/drivers', '12', 'transport'],
    ['/admin/schedules', '13', 'transport'],
    ['/admin/financial', '14', 'financial'],
    ['/admin/kpi', '18', 'analytics'],
    ['/admin/returns', '21', 'returns'],
    ['/admin/sensors', '23', 'iot'],
    ['/admin/monitoring', '24', 'iot'],
    ['/admin/users', '25', 'security'],
    ['/admin/integrations', '28', 'integrations'],
    ['/admin/map', '31', undefined],
    ['/admin/settings', '32', undefined],
    ['/admin', '1', undefined],
  ];

  const { selectedKey, defaultOpenKey } = useMemo(() => {
    for (const [prefix, key, parent] of routeMappings) {
      if (pathname.startsWith(prefix)) {
        return { selectedKey: key, defaultOpenKey: parent };
      }
    }
    return { selectedKey: '1', defaultOpenKey: undefined };
  }, [pathname]);

  const storageKey = 'adminMenuOpenKeys';
  const scrollStorageKey = 'adminMenuScrollTop';
  const widthStorageKey = 'adminSiderWidth';
  const collapsedStorageKey = 'adminSiderCollapsed';
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const fallback = defaultOpenKey ? [defaultOpenKey] : [];
    if (typeof window === 'undefined') return fallback;
    try {
      const stored = localStorage.getItem(storageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      const initial = Array.isArray(parsed) ? parsed : [];
      return defaultOpenKey ? Array.from(new Set([...initial, defaultOpenKey])) : initial;
    } catch {
      return fallback;
    }
  });

  // Keep parent section open on route change without collapsing others
  useEffect(() => {
    if (!defaultOpenKey) return;
    setOpenKeys((prev) => (prev.includes(defaultOpenKey) ? prev : [...prev, defaultOpenKey]));
  }, [defaultOpenKey]);

  // Persist and restore sidebar scroll position
  const menuScrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = Number(localStorage.getItem(scrollStorageKey) || '0');
      if (menuScrollRef.current && Number.isFinite(saved)) {
        menuScrollRef.current.scrollTop = saved;
      }
    } catch {}
  }, []);

  const defaultSiderWidth = 280;
  const [siderWidth, setSiderWidth] = useState<number>(defaultSiderWidth);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const isResizingRef = useRef(false);
  const siderRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const onMouseDownResize = (e: React.MouseEvent) => {
    if (collapsed) return;
    isResizingRef.current = true;
    const onMove = (ev: MouseEvent) => {
      if (!isResizingRef.current || !siderRef.current) return;
      const rect = siderRef.current.getBoundingClientRect();
      const newWidth = Math.min(420, Math.max(200, Math.round(ev.clientX - rect.left)));
      setSiderWidth(newWidth);
    };
    const onUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      try { localStorage.setItem(widthStorageKey, String(siderWidth)); } catch {}
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // After mount, hydrate width & collapsed from localStorage to avoid SSR/CSR mismatch
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawWidth = localStorage.getItem(widthStorageKey);
      const savedWidth = rawWidth ? parseInt(rawWidth, 10) : defaultSiderWidth;
      if (!Number.isNaN(savedWidth)) {
        setSiderWidth(Math.min(420, Math.max(180, savedWidth)));
      }
      const savedCollapsed = localStorage.getItem(collapsedStorageKey) === '1';
      setCollapsed(savedCollapsed);
    } catch {}
  }, []);

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard</Link>
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Управление заказами',
      children: [
        { key: '2', label: <Link href="/admin/orders">Все заказы</Link> },
        { key: '3', label: <Link href="/admin/orders/new">Новый заказ</Link> },
        { key: '4', label: <Link href="/admin/orders/batches">Логистические партии</Link> }
      ]
    },
    {
      key: 'warehouse',
      icon: <HomeOutlined />,
      label: 'Управление складом',
      children: [
        { key: '5', label: <Link href="/admin/warehouses">Склады и РЦ</Link> },
        { key: '6', label: <Link href="/admin/inventory">Инвентаризация</Link> },
        { key: '7', label: <Link href="/admin/picking">Сборочные листы</Link> },
        { key: '8', label: <Link href="/admin/products">Товары и запасы</Link> },
        { key: '9', label: <Link href="/admin/locations">Адресное хранение</Link> }
      ]
    },
    {
      key: 'transport',
      icon: <CarOutlined />,
      label: 'Управление транспортом',
      children: [
        { key: '10', label: <Link href="/admin/vehicles">Транспортные средства</Link> },
        { key: '11', label: <Link href="/admin/routes">Маршруты</Link> },
        { key: '12', label: <Link href="/admin/drivers">Водители</Link> },
        { key: '13', label: <Link href="/admin/schedules">Графики доставки</Link> }
      ]
    },
    {
      key: 'financial',
      icon: <DollarOutlined />,
      label: 'Финансы и договоры',
      children: [
        { key: '14', label: <Link href="/admin/financial">Финансовое управление</Link> }
      ]
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Аналитика и отчеты',
      children: [
        { key: '18', label: <Link href="/admin/kpi">KPI показатели</Link> }
      ]
    },
    {
      key: 'returns',
      icon: <ReloadOutlined />,
      label: 'Возвраты',
      children: [
        { key: '21', label: <Link href="/admin/returns">Управление возвратами</Link> }
      ]
    },
    {
      key: 'iot',
      icon: <CloudOutlined />,
      label: 'IoT интеграция',
      children: [
        { key: '23', label: <Link href="/admin/sensors">Датчики</Link> }
      ]
    },
    {
      key: 'security',
      icon: <SafetyOutlined />,
      label: 'Безопасность',
      children: [
        { key: '25', label: <Link href="/admin/users">Пользователи</Link> }
      ]
    },
    {
  key: 'integrations',
  icon: <DatabaseOutlined />,
  label: 'Интеграции',
  children: [
    { key: '28', label: <Link href="/admin/integrations">Все интеграции</Link> }
  ]
}

,

    {
      key: '31',
      icon: <GlobalOutlined />,
      label: <Link href="/admin/map">Карта</Link>
    },
    {
      key: '32',
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">Настройки</Link>
    }
  ];
  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }} suppressHydrationWarning>
      <Sider
        ref={siderRef as any}
        breakpoint="lg"
        collapsedWidth={100}
        collapsible
        collapsed={mounted ? collapsed : false}
        width={mounted ? siderWidth : defaultSiderWidth}
        theme={isDark ? 'dark' : 'light'}
        trigger={null}
        onCollapse={(val) => {
          setCollapsed(val);
          try { localStorage.setItem(collapsedStorageKey, val ? '1' : '0'); } catch {}
          // Trigger layout listeners (e.g. charts) after collapse animation ends
          setTimeout(() => bump(), 300);
        }}
        style={{ position: 'relative', background: 'transparent', marginRight: 24 }}
      >
        <div
          className="siderShell"
          style={{
            margin: '16px',
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorder}`,
            borderRadius: 16,
            boxShadow: token.boxShadowSecondary,
            position: 'relative',
            maxHeight: 'calc(100vh - 32px)',
            overflow: 'visible'
          }}
        >
          <div style={{ color: token.colorText, padding: collapsed ? 10 : 16, textAlign: 'center', fontWeight: 'bold' }} suppressHydrationWarning>
            Logistics Admin
          </div>
          <div
            ref={menuScrollRef}
            className="menuScroll"
            style={{ overflowY: 'auto', padding: 0, overscrollBehavior: 'contain' as any }}
            onScroll={(e) => {
              if (typeof window === 'undefined') return;
              try {
                const top = (e.currentTarget as HTMLDivElement).scrollTop;
                localStorage.setItem(scrollStorageKey, String(top));
              } catch {}
            }}
          >
            <Menu
              theme={isDark ? 'dark' : 'light'}
              mode="inline"
              inlineIndent={16}
              selectedKeys={[selectedKey]}
              openKeys={mounted ? openKeys : []}
              onOpenChange={(keys) => {
                const next = keys as string[];
                if (next.length === openKeys.length && next.every(k => openKeys.includes(k))) return;
                setOpenKeys(next);
                if (typeof window !== 'undefined') {
                  try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
                }
              }}
              style={{ background: 'transparent', padding: collapsed ? '4px' : '8px' }}
              items={menuItems}
            />
          </div>
          {/* Floating collapse button aligned with logo (half overlap, circular) */}
          <div style={{ position: 'absolute', top: 44, right: -15, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
            <button
              onClick={() => {
                const next = !collapsed;
                setCollapsed(next);
                try { localStorage.setItem(collapsedStorageKey, next ? '1' : '0'); } catch {}
                setTimeout(() => bump(), 300);
              }}
              className="siderCollapseBtn"
              style={{
                pointerEvents: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 24,
                minWidth: 24,
                padding: 0,
                borderRadius: '50%',
                border: `1px solid ${token.colorBorder}`,
                background: token.colorBgContainer,
                color: token.colorText,
                boxShadow: token.boxShadowSecondary,
                cursor: 'pointer'
              }}
              aria-label={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
            >
              {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
            </button>
          </div>
          {!collapsed && (
            <div
              onMouseDown={onMouseDownResize}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 6,
                height: '100%',
                cursor: 'col-resize',
                userSelect: 'none'
              }}
              title="Перетащите, чтобы изменить ширину меню"
            />
          )}
        </div>
        
        <style jsx>{`
			.menuScroll {
				-ms-overflow-style: none; /* IE and Edge */
				scrollbar-width: none; /* Firefox */
			}
			.menuScroll::-webkit-scrollbar {
				width: 0;
				height: 0;
				display: none; /* Chrome, Safari, Opera */
			}
        /* Add breathing space to menu items */
        :global(.ant-menu-inline .ant-menu-item),
        :global(.ant-menu-inline .ant-menu-submenu-title) {
          margin: 10px 10px;
          height: 40px;
          line-height: 40px;
          border-radius: 10px;
        }
		`}</style>
      </Sider>
      <Layout>
        <Header style={{ 
          background: token.colorBgContainer, 
          padding: '0 20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>Панель управления логистической системой</div>
          <div>
            <span style={{ marginRight: 12 }}>
              <ThemeToggle />
            </span>
            <NotificationSystem />
          </div>
        </Header>
        <Content style={{ margin: '24px', background: token.colorBgLayout }}>
          <div style={{ padding: 24, background: token.colorBgContainer, minHeight: 360, borderRadius: 16, border: `1px solid ${token.colorBorder}` }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
