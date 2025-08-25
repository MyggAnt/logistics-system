import express from 'express';
import { AppDataSource } from '../data-source';
import { Order } from '../entities/Order';
import { OrderService } from '../services/OrderService';

const router = express.Router();
const orderService = new OrderService();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find({
      relations: ['vehicle'],
      order: { createdAt: 'DESC' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['vehicle']
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await orderRepo.update({ id: parseInt(req.params.id) }, req.body);
    const updatedOrder = await orderRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['vehicle']
    });
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await orderRepo.remove(order);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(parseInt(req.params.id), status as Order['status']);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Assign vehicle to order
router.post('/:id/assign-vehicle', async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const order = await orderService.assignVehicleToOrder(parseInt(req.params.id), vehicleId);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign vehicle to order' });
  }
});

// Get orders by status
router.get('/status/:status', async (req, res) => {
  try {
    const orders = await orderService.getOrdersByStatus(req.params.status as Order['status']);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders by status' });
  }
});

// Get orders by priority
router.get('/priority/:priority', async (req, res) => {
  try {
    const orders = await orderService.getOrdersByPriority(req.params.priority as Order['priority']);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders by priority' });
  }
});

// Get order statistics
router.get('/statistics/summary', async (req, res) => {
  try {
    const stats = await orderService.getOrderStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

// Search orders
router.get('/search/:query', async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const query = req.params.query;
    
    const orders = await orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.vehicle', 'vehicle')
      .where('order.customerName ILIKE :query', { query: `%${query}%` })
      .orWhere('order.orderId ILIKE :query', { query: `%${query}%` })
      .orWhere('order.destination ILIKE :query', { query: `%${query}%` })
      .orderBy('order.createdAt', 'DESC')
      .getMany();
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search orders' });
  }
});

export default router;
