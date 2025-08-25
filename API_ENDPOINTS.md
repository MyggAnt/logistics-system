# API Endpoints - Логистическая система

## Обзор

Система предоставляет GraphQL API для всех основных операций. Все запросы требуют аутентификации через JWT токен.

## Аутентификация

### Вход в систему
```graphql
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
      id
      username
      email
      roles {
        name
        permissions {
          resource
          action
        }
      }
    }
  }
}
```

### Обновление токена
```graphql
mutation RefreshToken($token: String!) {
  refreshToken(token: $token) {
    token
    expiresAt
  }
}
```

## Модуль управления заказами

### Получение заказов
```graphql
query GetOrders($filter: OrderFilterInput) {
  orders(filter: $filter) {
    id
    orderId
    orderType
    sourceChannel
    customerName
    destination
    status
    priority
    totalAmount
    deliveryCost
    estimatedDelivery
    actualDelivery
    sourceWarehouse {
      name
      city
    }
    destinationWarehouse {
      name
      city
    }
    products {
      name
      sku
      quantity
    }
    vehicle {
      plateNumber
      driverName
    }
  }
}
```

### Создание заказа
```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    orderId
    status
    createdAt
  }
}
```

### Обновление статуса заказа
```graphql
mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
  updateOrderStatus(id: $id, status: $status) {
    id
    status
    updatedAt
  }
}
```

### Объединение в логистическую партию
```graphql
mutation CreateLogisticBatch($input: CreateLogisticBatchInput!) {
  createLogisticBatch(input: $input) {
    id
    batchId
    status
    orders {
      orderId
      customerName
    }
  }
}
```

## Модуль управления складом (WMS)

### Получение информации о складе
```graphql
query GetWarehouse($id: ID!) {
  warehouse(id: $id) {
    id
    name
    address
    city
    type
    status
    totalCapacity
    usedCapacity
    products {
      name
      sku
      quantity
      reservedQuantity
      availableQuantity
    }
  }
}
```

### Получение товаров по местоположению
```graphql
query GetProductsByLocation($warehouseId: ID!, $zone: String) {
  productsByLocation(warehouseId: $warehouseId, zone: $zone) {
    id
    name
    sku
    quantity
    location {
      locationCode
      zone
      aisle
      rack
      level
    }
  }
}
```

### Создание сборочного листа
```graphql
mutation CreatePickingList($input: CreatePickingListInput!) {
  createPickingList(input: $input) {
    id
    pickingListId
    status
    totalItems
    items {
      product {
        name
        sku
      }
      requiredQuantity
      location {
        locationCode
      }
    }
  }
}
```

### Обновление статуса сборочного листа
```graphql
mutation UpdatePickingListStatus($id: ID!, $status: PickingListStatus!) {
  updatePickingListStatus(id: $id, status: $status) {
    id
    status
    actualStartDate
    actualEndDate
  }
}
```

### Проведение инвентаризации
```graphql
mutation CreateInventory($input: CreateInventoryInput!) {
  createInventory(input: $input) {
    id
    inventoryId
    status
    totalItems
  }
}
```

## Модуль управления транспортом (TMS)

### Получение транспортных средств
```graphql
query GetVehicles($filter: VehicleFilterInput) {
  vehicles(filter: $filter) {
    id
    vehicleId
    plateNumber
    model
    type
    status
    capacity
    currentLocation
    currentLatitude
    currentLongitude
    lastGpsUpdate
    driverName
    driverPhone
  }
}
```

### Создание маршрута
```graphql
mutation CreateRoute($input: CreateRouteInput!) {
  createRoute(input: $input) {
    id
    routeId
    name
    status
    totalDistance
    estimatedDuration
    points {
      sequenceNumber
      name
      address
      type
      plannedArrival
    }
  }
}
```

### Обновление GPS координат
```graphql
mutation UpdateVehicleLocation($id: ID!, $latitude: Float!, $longitude: Float!) {
  updateVehicleLocation(id: $id, latitude: $latitude, longitude: $longitude) {
    id
    currentLatitude
    currentLongitude
    lastGpsUpdate
  }
}
```

### Мониторинг маршрута
```graphql
query GetRouteStatus($id: ID!) {
  route(id: $id) {
    id
    status
    actualStartDate
    actualEndDate
    points {
      sequenceNumber
      name
      actualArrival
      actualDeparture
      status
    }
    vehicle {
      currentLocation
      estimatedArrival
    }
  }
}
```

## Модуль финансового и договорного учёта

### Создание счёта
```graphql
mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
    id
    invoiceNumber
    status
    totalAmount
    dueDate
    customerName
  }
}
```

### Получение счетов
```graphql
query GetInvoices($filter: InvoiceFilterInput) {
  invoices(filter: $filter) {
    id
    invoiceNumber
    status
    customerName
    totalAmount
    dueDate
    paymentDate
    balance
  }
}
```

### Создание договора
```graphql
mutation CreateContract($input: CreateContractInput!) {
  createContract(input: $input) {
    id
    contractNumber
    name
    status
    counterpartyName
    startDate
    endDate
  }
}
```

### Управление платежами
```graphql
mutation RecordPayment($invoiceId: ID!, $amount: Float!, $method: String!) {
  recordPayment(invoiceId: $invoiceId, amount: $amount, method: $method) {
    id
    paidAmount
    balance
    paymentDate
  }
}
```

## Модуль безопасности и администрирования

### Создание пользователя
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    username
    email
    status
    roles {
      name
      permissions {
        resource
        action
      }
    }
  }
}
```

### Управление ролями
```graphql
mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    id
    name
    description
    permissions {
      resource
      action
      effect
    }
  }
}
```

### Назначение ролей пользователю
```graphql
mutation AssignRoleToUser($userId: ID!, $roleId: ID!) {
  assignRoleToUser(userId: $userId, roleId: $roleId) {
    id
    username
    roles {
      name
      description
    }
  }
}
```

### Получение журнала активности
```graphql
query GetUserActivity($userId: ID, $filter: ActivityFilterInput) {
  userActivity(userId: $userId, filter: $filter) {
    id
    action
    resource
    resourceId
    details
    ipAddress
    timestamp
    isSuccessful
    user {
      username
    }
  }
}
```

## Модуль возвратов (Reverse Logistics)

### Создание возврата
```graphql
mutation CreateReturn($input: CreateReturnInput!) {
  createReturn(input: $input) {
    id
    returnId
    type
    status
    reason
    returnDate
    items {
      product {
        name
        sku
      }
      quantity
      condition
      disposition
    }
  }
}
```

### Обработка возврата
```graphql
mutation ProcessReturn($id: ID!, $status: ReturnStatus!) {
  processReturn(id: $id, status: $status) {
    id
    status
    processedDate
    processedBy {
      username
    }
  }
}
```

## Модуль IoT интеграции

### Получение показаний датчиков
```graphql
query GetSensorReadings($sensorId: ID!, $from: String!, $to: String!) {
  sensorReadings(sensorId: $sensorId, from: $from, to: $to) {
    id
    value
    unit
    timestamp
    quality
    isAlert
    alertMessage
  }
}
```

### Создание датчика
```graphql
mutation CreateIotSensor($input: CreateIotSensorInput!) {
  createIotSensor(input: $input) {
    id
    sensorId
    name
    type
    status
    minThreshold
    maxThreshold
    location
  }
}
```

## Модуль аналитики и KPI

### Получение KPI показателей
```graphql
query GetKpiMetrics($type: KpiType, $warehouseId: ID, $period: String!) {
  kpiMetrics(type: $type, warehouseId: $warehouseId, period: $period) {
    id
    name
    type
    value
    unit
    target
    performance
    measurementDate
  }
}
```

### Получение статистики
```graphql
query GetStatistics($warehouseId: ID, $period: String!) {
  statistics(warehouseId: $warehouseId, period: $period) {
    orders {
      total
      pending
      inTransit
      delivered
      cancelled
    }
    vehicles {
      total
      available
      inUse
      maintenance
    }
    revenue {
      current
      previous
      growth
    }
  }
}
```

## Подписки (Real-time обновления)

### Подписка на обновления заказов
```graphql
subscription OrderUpdated {
  orderUpdated {
    id
    orderId
    status
    updatedAt
  }
}
```

### Подписка на обновления транспорта
```graphql
subscription VehicleUpdated {
  vehicleUpdated {
    id
    currentLocation
    currentLatitude
    currentLongitude
    lastGpsUpdate
  }
}
```

### Подписка на уведомления
```graphql
subscription NotificationCreated {
  notificationCreated {
    id
    type
    title
    message
    action {
      text
      url
    }
    createdAt
  }
}
```

## Фильтры и пагинация

### Пример использования фильтров
```graphql
query GetFilteredOrders($filter: OrderFilterInput!, $pagination: PaginationInput!) {
  orders(filter: $filter, pagination: $pagination) {
    items {
      id
      orderId
      customerName
      status
    }
    total
    page
    pageSize
    totalPages
  }
}
```

### Типы фильтров
```graphql
input OrderFilterInput {
  status: OrderStatus
  orderType: OrderType
  sourceChannel: SourceChannel
  priority: Priority
  dateFrom: String
  dateTo: String
  warehouseId: ID
  customerName: String
}

input PaginationInput {
  page: Int!
  pageSize: Int!
  sortBy: String
  sortOrder: SortOrder
}
```

## Обработка ошибок

Все API endpoints возвращают стандартизированные ошибки:

```graphql
type Error {
  code: String!
  message: String!
  field: String
  details: String
}

type ApiResponse {
  success: Boolean!
  data: JSON
  errors: [Error!]
}
```

## Rate Limiting

API имеет ограничения на количество запросов:
- **Аутентифицированные пользователи:** 1000 запросов/час
- **Неаутентифицированные:** 100 запросов/час
- **Webhook endpoints:** 10000 запросов/час

## Версионирование

API поддерживает версионирование через заголовок:
```
X-API-Version: v1
```

Текущая версия: **v1**
