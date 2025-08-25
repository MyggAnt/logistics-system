import { AppDataSource } from '../data-source';
import { Order } from '../entities/Order';
import { Vehicle } from '../entities/Vehicle';
import { Notification } from '../entities/Notification';

export class OrderService {
  private orderRepo = AppDataSource.getRepository(Order);
  private vehicleRepo = AppDataSource.getRepository(Vehicle);
  private notificationRepo = AppDataSource.getRepository(Notification);

  async createOrder(orderData: Partial<Order>) {
    const order = this.orderRepo.create(orderData as Partial<Order>);
    const savedOrder: Order = await this.orderRepo.save(order);

    // Create notification for new order
    await this.createNotification(
      'info',
      'Новый заказ',
      `Получен новый заказ ${savedOrder.orderId} от клиента ${savedOrder.customerName}`,
      { text: 'Просмотреть заказ', orderId: savedOrder.id },
      { orderId: savedOrder.id }
    );

    return savedOrder;
  }

  async updateOrderStatus(orderId: number, status: Order['status']) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    await this.orderRepo.update({ id: orderId }, { status });
    const updatedOrder = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['vehicle']
    });

    // Create notification for status change
    const statusMessages = {
      'in_transit': 'Заказ взят в работу',
      'delivered': 'Заказ доставлен',
      'cancelled': 'Заказ отменен'
    };

    if (statusMessages[status as keyof typeof statusMessages]) {
      await this.createNotification(
        status === 'delivered' ? 'success' : 'info',
        statusMessages[status as keyof typeof statusMessages],
        `Заказ ${order.orderId} ${statusMessages[status as keyof typeof statusMessages].toLowerCase()}`,
        { text: 'Просмотреть заказ', orderId: updatedOrder?.id ?? orderId },
        { orderId: updatedOrder?.id ?? orderId }
      );
    }

    if (!updatedOrder) throw new Error('Order not found after update');
    return updatedOrder;
  }

  async assignVehicleToOrder(orderId: number, vehicleId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId } });

    if (!order) throw new Error('Order not found');
    if (!vehicle) throw new Error('Vehicle not found');
    if (vehicle.status !== 'available') throw new Error('Vehicle is not available');

    // Update vehicle status to in_use
    await this.vehicleRepo.update({ id: vehicleId }, { status: 'in_use' as Vehicle['status'] });

    // Update order with vehicle assignment
    await this.orderRepo.update({ id: orderId }, { 
      vehicleId,
      status: 'in_transit' as Order['status']
    });

    const updatedOrder = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['vehicle']
    });

    // Create notification
    await this.createNotification(
      'info',
      'Заказ назначен',
      `Заказ ${order.orderId} назначен на транспортное средство ${vehicle.plateNumber}`,
      { text: 'Просмотреть заказ', orderId: updatedOrder?.id ?? orderId },
      { orderId: updatedOrder?.id ?? orderId, vehicleId: vehicle.id }
    );

    if (!updatedOrder) throw new Error('Order not found after vehicle assignment');
    return updatedOrder;
  }

  async getOrdersByStatus(status: Order['status']) {
    return await this.orderRepo.find({
      where: { status },
      relations: ['vehicle'],
      order: { createdAt: 'DESC' }
    });
  }

  async getOrdersByPriority(priority: Order['priority']) {
    return await this.orderRepo.find({
      where: { priority },
      relations: ['vehicle'],
      order: { createdAt: 'DESC' }
    });
  }

  async getOrderStatistics() {
    const orders = await this.orderRepo.find();

    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      inTransit: orders.filter(o => o.status === 'in_transit').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  }

  private async createNotification(
    type: 'info' | 'success' | 'warning' | 'error',
    title: string,
    message: string,
    action?: any,
    metadata?: any
  ) {
    const notification = this.notificationRepo.create({
      type,
      title,
      message,
      action,
      metadata
    });
    return await this.notificationRepo.save(notification);
  }
}
