import { AppDataSource } from './data-source';
import { Order } from './entities/Order';
import { Vehicle } from './entities/Vehicle';
import { Notification } from './entities/Notification';
import { Product } from './entities/Product';
import { PubSub } from 'graphql-subscriptions';
import { FindOptionsWhere } from 'typeorm';

const pubsub = new PubSub();

type OrderStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';
type OrderPriority = 'low' | 'medium' | 'high';
type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service';
type NotificationType = 'info' | 'success' | 'warning' | 'error';

const statusMessages: Record<OrderStatus, string> = {
  pending: 'Заказ ожидает обработки',
  in_transit: 'Заказ взят в работу',
  delivered: 'Заказ доставлен',
  cancelled: 'Заказ отменен'
};

const generateOrderId = async (): Promise<string> => {
  const orderRepo = AppDataSource.getRepository(Order);
  const count = await orderRepo.count();
  return `ORD-${String(count + 1).padStart(3, '0')}`;
};

const generateVehicleId = async (): Promise<string> => {
  const vehicleRepo = AppDataSource.getRepository(Vehicle);
  const count = await vehicleRepo.count();
  return `VEH-${String(count + 1).padStart(3, '0')}`;
};

const createNotification = async (
  type: NotificationType,
  title: string,
  message: string,
  action?: any,
  metadata?: any
): Promise<Notification> => {
  const notificationRepo = AppDataSource.getRepository(Notification);
  const notification = notificationRepo.create({
    type,
    title,
    message,
    action,
    metadata
  });
  const savedNotification = await notificationRepo.save(notification);
  pubsub.publish('NOTIFICATION_CREATED', { notificationCreated: savedNotification });
  return savedNotification;
};

export const resolvers = {
  Query: {
    // ===== ORDERS =====
    orders: async (): Promise<Order[]> => {
      const orderRepo = AppDataSource.getRepository(Order);
      return await orderRepo.find({
        relations: ['vehicle'],
        order: { createdAt: 'DESC' }
      });
    },

    order: async (_: any, { id }: { id: string }): Promise<Order> => {
      const orderRepo = AppDataSource.getRepository(Order);
      const order = await orderRepo.findOne({
        where: { id: parseInt(id) },
        relations: ['vehicle']
      });
      if (!order) throw new Error('Order not found');
      return order;
    },

    ordersByStatus: async (_: any, { status }: { status: OrderStatus }): Promise<Order[]> => {
      const orderRepo = AppDataSource.getRepository(Order);
      return await orderRepo.find({
        where: { status } as FindOptionsWhere<Order>,
        relations: ['vehicle'],
        order: { createdAt: 'DESC' }
      });
    },

    ordersByPriority: async (_: any, { priority }: { priority: OrderPriority }): Promise<Order[]> => {
      const orderRepo = AppDataSource.getRepository(Order);
      return await orderRepo.find({
        where: { priority } as FindOptionsWhere<Order>,
        relations: ['vehicle'],
        order: { createdAt: 'DESC' }
      });
    },

    // ===== VEHICLES =====
    vehicles: async (): Promise<Vehicle[]> => {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      return await vehicleRepo.find({
        relations: ['orders'],
        order: { createdAt: 'DESC' }
      });
    },

    vehicle: async (_: any, { id }: { id: string }): Promise<Vehicle> => {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const vehicle = await vehicleRepo.findOne({
        where: { id: parseInt(id) },
        relations: ['orders']
      });
      if (!vehicle) throw new Error('Vehicle not found');
      return vehicle;
    },

    vehiclesByStatus: async (_: any, { status }: { status: VehicleStatus }): Promise<Vehicle[]> => {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      return await vehicleRepo.find({
        where: { status } as FindOptionsWhere<Vehicle>,
        relations: ['orders'],
        order: { createdAt: 'DESC' }
      });
    },

    availableVehicles: async (): Promise<Vehicle[]> => {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      return await vehicleRepo.find({
        where: { status: 'available' } as FindOptionsWhere<Vehicle>,
        relations: ['orders'],
        order: { createdAt: 'DESC' }
      });
    },

    // ===== NOTIFICATIONS =====
    notifications: async (): Promise<Notification[]> => {
      const notificationRepo = AppDataSource.getRepository(Notification);
      return await notificationRepo.find({
        order: { createdAt: 'DESC' }
      });
    },

    unreadNotifications: async (): Promise<Notification[]> => {
      const notificationRepo = AppDataSource.getRepository(Notification);
      return await notificationRepo.find({
        where: { read: false },
        order: { createdAt: 'DESC' }
      });
    },

    notification: async (_: any, { id }: { id: string }): Promise<Notification> => {
      const notificationRepo = AppDataSource.getRepository(Notification);
      const notification = await notificationRepo.findOne({
        where: { id: parseInt(id) }
      });
      if (!notification) throw new Error('Notification not found');
      return notification;
    },

    // ===== PRODUCTS =====
    products: async (): Promise<Product[]> => {
      const productRepo = AppDataSource.getRepository(Product);
      return await productRepo.find({ order: { createdAt: 'DESC' } });
    },

    product: async (_: any, { id }: { id: string }): Promise<Product> => {
      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOne({ where: { id: parseInt(id) } });
      if (!product) throw new Error('Product not found');
      return product;
    },

    productsByCategory: async (_: any, { category }: { category: string }): Promise<Product[]> => {
      const productRepo = AppDataSource.getRepository(Product);
      return await productRepo.find({ where: { category } });
    },

    // ===== STATISTICS =====
    statistics: async () => {
      const orderRepo = AppDataSource.getRepository(Order);
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const productRepo = AppDataSource.getRepository(Product);

      const [orders, vehicles, products] = await Promise.all([
        orderRepo.find(),
        vehicleRepo.find(),
        productRepo.find()
      ]);

      return {
        orders: {
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending').length,
          inTransit: orders.filter(o => o.status === 'in_transit').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length,
        },
        vehicles: {
          total: vehicles.length,
          available: vehicles.filter(v => v.status === 'available').length,
          inUse: vehicles.filter(v => v.status === 'in_use').length,
          maintenance: vehicles.filter(v => v.status === 'maintenance').length,
          outOfService: vehicles.filter(v => v.status === 'out_of_service').length,
        },
        products: {
          total: products.length,
          perishable: products.filter(p => p.isPerishable).length,
          refrigerated: products.filter(p => p.requiresRefrigeration).length,
        },
        revenue: {
          current: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
          previous: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) * 0.9,
          growth: 13.6,
        }
      };
    },
  },

  Mutation: {
    // ==== ORDERS ====
    createOrder: async (_: any, { input }: { input: Partial<Order> }, context: { io: any }): Promise<Order> => {
      const orderRepo = AppDataSource.getRepository(Order);
      const { io } = context;

      const orderId = await generateOrderId();
      const orderInput: Partial<Order> = {
        ...(input as Partial<Order>),
        orderId,
        estimatedDelivery: new Date(input.estimatedDelivery as unknown as string),
      };
      const order = orderRepo.create(orderInput);

      const savedOrder = await orderRepo.save(order);

      await createNotification(
        'info',
        'Новый заказ',
        `Получен новый заказ ${orderId} от клиента ${input.customerName}`,
        { text: 'Просмотреть заказ', orderId: savedOrder.id },
        { orderId: savedOrder.id }
      );

      io.emit('orderCreated', savedOrder);
      pubsub.publish('ORDER_UPDATED', { orderUpdated: savedOrder });

      return savedOrder;
    },

    updateOrder: async (_: any, { id, input }: { id: string; input: Partial<Order> }, context: { io: any }): Promise<Order> => {
      const orderRepo = AppDataSource.getRepository(Order);
      const { io } = context;

      const order = await orderRepo.findOne({ where: { id: parseInt(id) } });
      if (!order) throw new Error('Order not found');

      if (input.estimatedDelivery) input.estimatedDelivery = new Date(input.estimatedDelivery as unknown as string);
      if (input.actualDelivery) input.actualDelivery = new Date(input.actualDelivery as unknown as string);

      await orderRepo.update({ id: parseInt(id) }, input);
      const updatedOrder = await orderRepo.findOne({
        where: { id: parseInt(id) },
        relations: ['vehicle']
      });

      if (!updatedOrder) throw new Error('Order not found after update');

      io.emit('orderUpdated', updatedOrder);
      pubsub.publish('ORDER_UPDATED', { orderUpdated: updatedOrder });

      return updatedOrder;
    },

    deleteOrder: async (_: any, { id }: { id: string }): Promise<boolean> => {
      const orderRepo = AppDataSource.getRepository(Order);
      const order = await orderRepo.findOne({ where: { id: parseInt(id) } });
      if (!order) throw new Error('Order not found');

      await orderRepo.remove(order);
      return true;
    },

    updateOrderStatus: async (_: any, { id, status }: { id: string; status: OrderStatus }, context: { io: any }): Promise<Order> => {
      const orderRepo = AppDataSource.getRepository(Order);
      const { io } = context;

      const order = await orderRepo.findOne({ where: { id: parseInt(id) } });
      if (!order) throw new Error('Order not found');

      await orderRepo.update({ id: parseInt(id) }, { status });
      const updatedOrder = await orderRepo.findOne({
        where: { id: parseInt(id) },
        relations: ['vehicle']
      });

      if (!updatedOrder) throw new Error('Order not found after update');

      if (status in statusMessages) {
        await createNotification(
          status === 'delivered' ? 'success' : 'info',
          statusMessages[status],
          `Заказ ${order.orderId} ${statusMessages[status].toLowerCase()}`,
          { text: 'Просмотреть заказ', orderId: updatedOrder.id },
          { orderId: updatedOrder.id }
        );
      }

      io.emit('orderUpdated', updatedOrder);
      pubsub.publish('ORDER_UPDATED', { orderUpdated: updatedOrder });

      return updatedOrder;
    },

    // ==== VEHICLES ====
    createVehicle: async (_: any, { input }: { input: Partial<Vehicle> }, context: { io: any }): Promise<Vehicle> => {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const { io } = context;

      const vehicleId = await generateVehicleId();
      const vehicleInput: Partial<Vehicle> = {
        ...(input as Partial<Vehicle>),
        vehicleId,
        lastMaintenance: new Date(),
        nextMaintenance: new Date(input.nextMaintenance as unknown as string),
        fuelLevel: (input.fuelLevel as number | undefined) ?? 100,
        mileage: (input.mileage as number | undefined) ?? 0,
      };
      const vehicle = vehicleRepo.create(vehicleInput);

      const savedVehicle = await vehicleRepo.save(vehicle);

      io.emit('vehicleCreated', savedVehicle);
      pubsub.publish('VEHICLE_UPDATED', { vehicleUpdated: savedVehicle });

      return savedVehicle;
    },

    updateVehicle: async (_: any, { id, input }: { id: string; input: Partial<Vehicle> }, context: { io: any }): Promise<Vehicle> => {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const { io } = context;

      const vehicle = await vehicleRepo.findOne({ where: { id: parseInt(id) } });
      if (!vehicle) throw new Error('Vehicle not found');

      if (input.lastMaintenance) input.lastMaintenance = new Date(input.lastMaintenance as unknown as string);
      if (input.nextMaintenance) input.nextMaintenance = new Date(input.nextMaintenance as unknown as string);

      await vehicleRepo.update({ id: parseInt(id) }, input);
      const updatedVehicle = await vehicleRepo.findOne({
        where: { id: parseInt(id) },
        relations: ['orders']
      });

      if (!updatedVehicle) throw new Error('Vehicle not found after update');

      io.emit('vehicleUpdated', updatedVehicle);
      pubsub.publish('VEHICLE_UPDATED', { vehicleUpdated: updatedVehicle });

      return updatedVehicle;
    },

    deleteVehicle: async (_: any, { id }: { id: string }): Promise<boolean> => {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const vehicle = await vehicleRepo.findOne({ where: { id: parseInt(id) } });
      if (!vehicle) throw new Error('Vehicle not found');

      await vehicleRepo.remove(vehicle);
      return true;
    },

    updateVehicleStatus: async (_: any, { id, status }: { id: string; status: VehicleStatus }, context: { io: any }): Promise<Vehicle> => {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const { io } = context;

      const vehicle = await vehicleRepo.findOne({ where: { id: parseInt(id) } });
      if (!vehicle) throw new Error('Vehicle not found');

      await vehicleRepo.update({ id: parseInt(id) }, { status });
      const updatedVehicle = await vehicleRepo.findOne({
        where: { id: parseInt(id) },
        relations: ['orders']
      });

      if (!updatedVehicle) throw new Error('Vehicle not found after update');

      io.emit('vehicleUpdated', updatedVehicle);
      pubsub.publish('VEHICLE_UPDATED', { vehicleUpdated: updatedVehicle });

      return updatedVehicle;
    },

    updateFuelLevel: async (_: any, { id, fuelLevel }: { id: string; fuelLevel: number }, context: { io: any }): Promise<Vehicle> => {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const { io } = context;

      const vehicle = await vehicleRepo.findOne({ where: { id: parseInt(id) } });
      if (!vehicle) throw new Error('Vehicle not found');

      await vehicleRepo.update({ id: parseInt(id) }, { fuelLevel });
      const updatedVehicle = await vehicleRepo.findOne({
        where: { id: parseInt(id) },
        relations: ['orders']
      });

      if (!updatedVehicle) throw new Error('Vehicle not found after update');

      if (fuelLevel < 20) {
        await createNotification(
          'warning',
          'Низкий уровень топлива',
          `Транспортное средство ${vehicle.plateNumber} имеет уровень топлива менее 20%`,
          { text: 'Просмотреть ТС', vehicleId: updatedVehicle.id },
          { vehicleId: updatedVehicle.id }
        );
      }

      io.emit('vehicleUpdated', updatedVehicle);
      pubsub.publish('VEHICLE_UPDATED', { vehicleUpdated: updatedVehicle });

      return updatedVehicle;
    },

    updateMileage: async (_: any, { id, mileage }: { id: string; mileage: number }, context: { io: any }): Promise<Vehicle> => {
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const { io } = context;

      const vehicle = await vehicleRepo.findOne({ where: { id: parseInt(id) } });
      if (!vehicle) throw new Error('Vehicle not found');

      await vehicleRepo.update({ id: parseInt(id) }, { mileage });
      const updatedVehicle = await vehicleRepo.findOne({
        where: { id: parseInt(id) },
        relations: ['orders']
      });

      if (!updatedVehicle) throw new Error('Vehicle not found after update');

      io.emit('vehicleUpdated', updatedVehicle);
      pubsub.publish('VEHICLE_UPDATED', { vehicleUpdated: updatedVehicle });

      return updatedVehicle;
    },

    // ==== PRODUCTS ====
    createProduct: async (_: any, { input }: { input: Partial<Product> }): Promise<Product> => {
      const productRepo = AppDataSource.getRepository(Product);
      const product = productRepo.create(input);
      const savedProduct = await productRepo.save(product);

      pubsub.publish('PRODUCT_UPDATED', { productUpdated: savedProduct });
      return savedProduct;
    },

    updateProduct: async (_: any, { id, input }: { id: string; input: Partial<Product> }): Promise<Product> => {
      const productRepo = AppDataSource.getRepository(Product);

      const product = await productRepo.findOne({ where: { id: parseInt(id) } });
      if (!product) throw new Error('Product not found');

      await productRepo.update({ id: parseInt(id) }, input);
      const updatedProduct = await productRepo.findOne({ where: { id: parseInt(id) } });

      if (!updatedProduct) throw new Error('Product not found after update');

      pubsub.publish('PRODUCT_UPDATED', { productUpdated: updatedProduct });
      return updatedProduct;
    },

    deleteProduct: async (_: any, { id }: { id: string }): Promise<boolean> => {
      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOne({ where: { id: parseInt(id) } });
      if (!product) throw new Error('Product not found');

      await productRepo.remove(product);
      return true;
    },

    // ==== NOTIFICATIONS ====
    createNotification: async (_: any, { type, title, message, action, metadata }: any): Promise<Notification> => {
      return await createNotification(type, title, message, action, metadata);
    },

    markNotificationAsRead: async (_: any, { id }: { id: string }): Promise<Notification> => {
      const notificationRepo = AppDataSource.getRepository(Notification);
      const notification = await notificationRepo.findOne({ where: { id: parseInt(id) } });
      if (!notification) throw new Error('Notification not found');

      notification.read = true;
      return await notificationRepo.save(notification);
    },

    markAllNotificationsAsRead: async (): Promise<boolean> => {
      const notificationRepo = AppDataSource.getRepository(Notification);
      await notificationRepo.update({ read: false }, { read: true });
      return true;
    },

    deleteNotification: async (_: any, { id }: { id: string }): Promise<boolean> => {
      const notificationRepo = AppDataSource.getRepository(Notification);
      const notification = await notificationRepo.findOne({ where: { id: parseInt(id) } });
      if (!notification) throw new Error('Notification not found');

      await notificationRepo.remove(notification);
      return true;
    },
  },

  Subscription: {
    orderUpdated: {
      subscribe: () => pubsub.asyncIterator(['ORDER_UPDATED']),
    },
    vehicleUpdated: {
      subscribe: () => pubsub.asyncIterator(['VEHICLE_UPDATED']),
    },
    productUpdated: {
      subscribe: () => pubsub.asyncIterator(['PRODUCT_UPDATED']),
    },
    notificationCreated: {
      subscribe: () => pubsub.asyncIterator(['NOTIFICATION_CREATED']),
    },
    statisticsUpdated: {
      subscribe: () => pubsub.asyncIterator(['STATISTICS_UPDATED']),
    },
  },
};

