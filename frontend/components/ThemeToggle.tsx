import React from 'react';
import { Switch, Tooltip } from 'antd';
import { BulbOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Tooltip title={isDark ? 'Светлая тема' : 'Тёмная тема'}>
      <Switch
        checked={isDark}
        onChange={toggleTheme}
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<BulbOutlined />}
      />
    </Tooltip>
  );
}


