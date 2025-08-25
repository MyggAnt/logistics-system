# Logistics System Backend

## 🚀 Функционал

### 📦 Основные возможности

1. **Управление заказами**
   - CRUD операции для заказов
   - Статусы: ожидает, в пути, доставлен, отменен
   - Приоритеты: низкий, средний, высокий
   - Назначение транспортных средств
   - Поиск и фильтрация

2. **Управление транспортными средствами**
   - CRUD операции для ТС
   - Статусы: доступен, в использовании, на обслуживании, неисправен
   - Мониторинг уровня топлива и пробега
   - Планирование технического обслуживания
   - Статистика использования

3. **Система уведомлений**
   - Автоматические уведомления о событиях
   - Типы: info, success, warning, error
   - Действия для уведомлений
   - Отметка как прочитанные

4. **Статистика и аналитика**
   - Статистика по заказам
   - Статистика по транспортным средствам
   - Анализ доходов
   - Утилизация ТС

### 🔌 API Endpoints

#### GraphQL API
- **Endpoint**: `http://localhost:3001/graphql`
- **Playground**: `http://localhost:3001/graphql`

#### REST API

**Заказы** (`/api/orders`)
- `GET /` - Получить все заказы
- `GET /:id` - Получить заказ по ID
- `POST /` - Создать заказ
- `PUT /:id` - Обновить заказ
- `DELETE /:id` - Удалить заказ
- `PATCH /:id/status` - Обновить статус заказа
- `POST /:id/assign-vehicle` - Назначить ТС заказу
- `GET /status/:status` - Заказы по статусу
- `GET /priority/:priority` - Заказы по приоритету
- `GET /statistics/summary` - Статистика заказов
- `GET /search/:query` - Поиск заказов

**Транспортные средства** (`/api/vehicles`)
- `GET /` - Получить все ТС
- `GET /:id` - Получить ТС по ID
- `POST /` - Создать ТС
- `PUT /:id` - Обновить ТС
- `DELETE /:id` - Удалить ТС
- `PATCH /:id/status` - Обновить статус ТС
- `PATCH /:id/fuel` - Обновить уровень топлива
- `PATCH /:id/mileage` - Обновить пробег
- `GET /available/list` - Доступные ТС
- `GET /status/:status` - ТС по статусу
- `GET /statistics/summary` - Статистика ТС
- `GET /utilization/overview` - Утилизация ТС
- `GET /maintenance/check` - Проверка ТО
- `GET /search/:query` - Поиск ТС
- `GET /:id/orders` - Заказы ТС

**Системные**
- `GET /health` - Проверка состояния сервера

### 🔄 WebSocket Events

**Заказы**
- `orderCreated` - Новый заказ создан
- `orderUpdated` - Заказ обновлен
- `orderDeleted` - Заказ удален

**Транспортные средства**
- `vehicleCreated` - Новое ТС создано
- `vehicleUpdated` - ТС обновлено
- `vehicleDeleted` - ТС удалено

**Уведомления**
- `notificationCreated` - Новое уведомление

### 📊 GraphQL Subscriptions

- `orderUpdated` - Обновления заказов
- `vehicleUpdated` - Обновления ТС
- `notificationCreated` - Новые уведомления
- `statisticsUpdated` - Обновления статистики

## 🛠️ Установка и запуск

### Требования
- Node.js 18+
- PostgreSQL 12+
- TypeScript

### Установка зависимостей
```bash
npm install
```

### Настройка базы данных
1. Создайте базу данных PostgreSQL
2. Обновите настройки в `src/data-source.ts`
3. Запустите миграции:
```bash
npm run migrate
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Запуск в продакшене
```bash
npm run build
npm start
```

### Слежение за изменениями
```bash
npm run watch
```

## 🗄️ База данных

### Сущности

**Order (Заказы)**
- `id` - Уникальный идентификатор
- `orderId` - Номер заказа (ORD-001, ORD-002, etc.)
- `customerName` - Название клиента
- `destination` - Адрес назначения
- `status` - Статус заказа
- `priority` - Приоритет
- `totalAmount` - Общая сумма
- `description` - Описание
- `estimatedDelivery` - Ожидаемая дата доставки
- `actualDelivery` - Фактическая дата доставки
- `vehicleId` - ID назначенного ТС
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

**Vehicle (Транспортные средства)**
- `id` - Уникальный идентификатор
- `vehicleId` - Номер ТС (VEH-001, VEH-002, etc.)
- `plateNumber` - Гос. номер
- `model` - Модель
- `capacity` - Грузоподъемность (кг)
- `status` - Статус ТС
- `driverName` - Водитель
- `lastMaintenance` - Последнее ТО
- `nextMaintenance` - Следующее ТО
- `fuelLevel` - Уровень топлива (%)
- `mileage` - Пробег (км)
- `notes` - Заметки
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

**Notification (Уведомления)**
- `id` - Уникальный идентификатор
- `type` - Тип уведомления
- `title` - Заголовок
- `message` - Сообщение
- `read` - Прочитано
- `action` - Действие (JSON)
- `metadata` - Метаданные (JSON)
- `createdAt` - Дата создания

## 🔧 Конфигурация

### Переменные окружения
Создайте файл `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_DATABASE=logistics
NODE_ENV=development
PORT=3001
```

### Настройка TypeORM
Файл `src/data-source.ts` содержит настройки подключения к базе данных.

## 📈 Мониторинг

### Health Check
```bash
curl http://localhost:3001/health
```

### Логирование
Сервер выводит логи в консоль с временными метками и уровнями важности.

## 🔒 Безопасность

- CORS настроен для всех источников (в продакшене ограничьте)
- Валидация входных данных
- Обработка ошибок
- Graceful shutdown

## 🚀 Производительность

- Connection pooling для PostgreSQL
- Кэширование запросов
- Оптимизированные запросы с relations
- WebSocket для real-time обновлений

## 📝 Примеры использования

### GraphQL Query
```graphql
query {
  orders {
    id
    orderId
    customerName
    status
    vehicle {
      plateNumber
      model
    }
  }
}
```

### REST API
```bash
# Получить все заказы
curl http://localhost:3001/api/orders

# Создать заказ
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "ООО Рога и Копыта",
    "destination": "Москва, ул. Тверская, 1",
    "priority": "high",
    "estimatedDelivery": "2024-02-01"
  }'
```

### WebSocket
```javascript
const socket = io('http://localhost:3001');
socket.on('orderUpdated', (order) => {
  console.log('Order updated:', order);
});
```
