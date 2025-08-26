import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';
import { Vehicle } from '../entities/Vehicle';
import { Notification } from '../entities/Notification';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const productRepo = AppDataSource.getRepository(Product);
    const orderRepo = AppDataSource.getRepository(Order);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const notificationRepo = AppDataSource.getRepository(Notification);

    // Очистка без TRUNCATE (чтобы не ругалось на FK)
    await notificationRepo.createQueryBuilder().delete().execute();
    await orderRepo.createQueryBuilder().delete().execute();
    await vehicleRepo.createQueryBuilder().delete().execute();
    await productRepo.createQueryBuilder().delete().execute();


    
    // 1. Создаем продукты (товары) 
    const products = [
      {
        name: 'Молоко 1л',
        description: 'Пастеризованное молоко 3.2%',
        price: 65,
        sku: 'MLK-001',
        quantity: 200,
        availableQuantity: 200,
        category: 'Молочные продукты',
        brand: 'Простоквашино',
        manufacturer: 'ООО "Молочный завод"',
        countryOfOrigin: 'Россия',
        isPerishable: true,
        shelfLifeDays: 7,
        requiresRefrigeration: true,
      },
      {
        name: 'Хлеб пшеничный',
        description: 'Хлеб белый, свежий, 500г',
        price: 40,
        sku: 'BRD-001',
        quantity: 150,
        availableQuantity: 150,
        category: 'Выпечка',
        brand: 'Булочная №1',
        manufacturer: 'Булочно-кондитерский комбинат',
        countryOfOrigin: 'Россия',
        isPerishable: true,
        shelfLifeDays: 3,
      },
      {
        name: 'Яблоки Грэнни Смит',
        description: 'Зелёные яблоки, свежие, 1кг',
        price: 120,
        sku: 'APL-001',
        quantity: 300,
        availableQuantity: 300,
        category: 'Фрукты',
        brand: 'Фруктовая страна',
        countryOfOrigin: 'Россия',
        isPerishable: true,
        shelfLifeDays: 14,
      },
      {
        name: 'Кола 2л',
        description: 'Газированный напиток Coca-Cola',
        price: 150,
        sku: 'DRK-001',
        quantity: 100,
        availableQuantity: 100,
        category: 'Напитки',
        brand: 'Coca-Cola',
        manufacturer: 'Coca-Cola Company',
        countryOfOrigin: 'Россия',
        isPerishable: false,
      }
    ];

    const savedProducts = await productRepo.save(products);
    console.log('📦 Products created:', savedProducts.length);

   
    // 2. Создаем транспорт
    const vehicles: Partial<Vehicle>[] = [
      {
        vehicleId: 'VEH-001',
        plateNumber: 'А123БВ77',
        model: 'Газель Next',
        capacity: 1500,
        status: 'in_use',
        driverName: 'Иванов И.И.',
        lastMaintenance: new Date('2024-01-10'),
        nextMaintenance: new Date('2024-02-10'),
        fuelLevel: 75,
        mileage: 45000,
      },
      {
        vehicleId: 'VEH-002',
        plateNumber: 'В456ГД77',
        model: 'Ford Transit',
        capacity: 2000,
        status: 'available',
        driverName: 'Петров П.П.',
        lastMaintenance: new Date('2024-01-05'),
        nextMaintenance: new Date('2024-02-05'),
        fuelLevel: 90,
        mileage: 32000,
      }
    ];

    const savedVehicles = await vehicleRepo.save(vehicles);
    console.log('🚚 Vehicles created:', savedVehicles.length);

    // 3. Создаем заказы
    const orders: Partial<Order>[] = [
      {
        orderId: 'ORD-001',
        customerName: 'ООО "Продукты24"',
        destination: 'Москва, ул. Тверская, 1',
        status: 'pending',
        priority: 'high',
        totalAmount: 10000,
        description: 'Доставка молочных продуктов',
        estimatedDelivery: new Date('2024-02-01'),
        vehicleId: savedVehicles[0].id,
        products: [savedProducts[0], savedProducts[1]],
      },
      {
        orderId: 'ORD-002',
        customerName: 'ИП Иванов',
        destination: 'Санкт-Петербург, Невский пр., 100',
        status: 'in_transit',
        priority: 'medium',
        totalAmount: 12000,
        description: 'Фрукты и напитки',
        estimatedDelivery: new Date('2024-02-03'),
        vehicleId: savedVehicles[1].id,
        products: [savedProducts[2], savedProducts[3]],
      }
    ];

    const savedOrders = await orderRepo.save(orders);
    console.log('📑 Orders created:', savedOrders.length);

  
    // 4. Создаем уведомления
    const notifications: Partial<Notification>[] = [
      {
        type: 'info',
        title: 'Новый заказ',
        message: `Создан заказ ${savedOrders[0].orderId}`,
        read: false,
        action: { text: 'Просмотреть заказ', orderId: savedOrders[0].id },
        metadata: { orderId: savedOrders[0].id }
      },
      {
        type: 'warning',
        title: 'Низкий уровень топлива',
        message: `ТС ${savedVehicles[0].plateNumber} имеет уровень топлива 20%`,
        read: false,
        action: { text: 'Просмотреть ТС', vehicleId: savedVehicles[0].id },
        metadata: { vehicleId: savedVehicles[0].id }
      }
    ];

    await productRepo.save(products);
    console.log('Products created:', products.length);

    console.log('🎉 Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();

