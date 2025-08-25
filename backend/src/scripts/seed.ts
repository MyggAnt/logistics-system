import { AppDataSource } from '../data-source';
import { Order } from '../entities/Order';
import { Notification } from '../entities/Notification';
import { Product } from '../entities/Product';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const orderRepo = AppDataSource.getRepository(Order);
    const productRepo = AppDataSource.getRepository(Product);
    const notificationRepo = AppDataSource.getRepository(Notification);

    // Очистка данных
    await notificationRepo.clear();
    await orderRepo.clear();
    await productRepo.clear();

    // Создаём товары
    const products: Partial<Product>[] = [
      {
        name: "Молоко 1л",
        description: "Свежее молоко 3.2% жирности",
        price: 65.0,
        sku: "MILK-001",
        quantity: 120,
        availableQuantity: 120,
        category: "Продукты питания",
        brand: "Домик в деревне",
        manufacturer: "Danone",
        countryOfOrigin: "Россия",
        isPerishable: true,
        shelfLifeDays: 7,
        requiresRefrigeration: true,
        abcClassification: "A",
        xyzClassification: "X",
      },
      {
        name: "Хлеб ржаной",
        description: "Свежий хлеб из ржаной муки",
        price: 40.0,
        sku: "BREAD-001",
        quantity: 80,
        availableQuantity: 80,
        category: "Продукты питания",
        brand: "Хлебозавод №1",
        manufacturer: "Хлебозавод №1",
        countryOfOrigin: "Россия",
        isPerishable: true,
        shelfLifeDays: 3,
        abcClassification: "A",
        xyzClassification: "Y",
      },
      {
        name: "Сахар 1кг",
        description: "Сахар-песок белый",
        price: 90.0,
        sku: "SUGAR-001",
        quantity: 200,
        availableQuantity: 200,
        category: "Продукты питания",
        brand: "Русский сахар",
        manufacturer: "РусАгро",
        countryOfOrigin: "Россия",
        abcClassification: "B",
        xyzClassification: "Y",
      },
      {
        name: "Шампунь Head&Shoulders",
        description: "Шампунь против перхоти 400 мл",
        price: 250.0,
        sku: "SHAMP-001",
        quantity: 60,
        availableQuantity: 60,
        category: "Бытовая химия",
        brand: "Head&Shoulders",
        manufacturer: "P&G",
        countryOfOrigin: "Германия",
        abcClassification: "B",
        xyzClassification: "Z",
      },
      {
        name: "Смартфон Xiaomi Redmi",
        description: "Смартфон 6.5'' 128GB",
        price: 15990.0,
        sku: "PHN-001",
        quantity: 25,
        availableQuantity: 25,
        category: "Электроника",
        brand: "Xiaomi",
        manufacturer: "Xiaomi Corp",
        countryOfOrigin: "Китай",
        abcClassification: "A",
        xyzClassification: "X",
      },
    ];

    const savedProducts = await productRepo.save(products);
    console.log('Products created:', savedProducts.length);

    // Привязываем товары к заказам
    const orders: Partial<Order>[] = [
      {
        orderId: 'ORD-001',
        customerName: 'ООО "Рога и Копыта"',
        destination: 'Москва, ул. Тверская, 1',
        status: 'pending',
        priority: 'high',
        totalAmount: 15000,
        description: 'Срочная доставка продуктов',
        estimatedDelivery: new Date('2024-02-01'),
        products: [savedProducts[0], savedProducts[1]],
      },
      {
        orderId: 'ORD-002',
        customerName: 'ИП Иванов',
        destination: 'Санкт-Петербург, Невский пр., 100',
        status: 'in_transit',
        priority: 'medium',
        totalAmount: 25000,
        description: 'Доставка электроники',
        estimatedDelivery: new Date('2024-02-03'),
        products: [savedProducts[4]],
      }
    ];

    const savedOrders = await orderRepo.save(orders);
    console.log('Orders created:', savedOrders.length);

    // Создаём уведомления
    const notifications: Partial<Notification>[] = [
      {
        type: 'info',
        title: 'Новый заказ',
        message: `Получен новый заказ ${savedOrders[0].orderId} от клиента ${savedOrders[0].customerName}`,
        read: false,
        action: { text: 'Просмотреть заказ', orderId: savedOrders[0].id },
        metadata: { orderId: savedOrders[0].id }
      }
    ];

    await notificationRepo.save(notifications);
    console.log('Notifications created:', notifications.length);

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();

