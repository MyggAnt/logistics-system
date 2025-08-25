import express from 'express';
import { AppDataSource } from '../data-source';
import { Vehicle } from '../entities/Vehicle';
import { VehicleService } from '../services/VehicleService';

const router = express.Router();
const vehicleService = new VehicleService();

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicles = await vehicleRepo.find({
      relations: ['orders'],
      order: { createdAt: 'DESC' }
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicle = await vehicleRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['orders']
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Create new vehicle
router.post('/', async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// Update vehicle
router.put('/:id', async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicle = await vehicleRepo.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    await vehicleRepo.update({ id: parseInt(req.params.id) }, req.body);
    const updatedVehicle = await vehicleRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['orders']
    });
    
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// Delete vehicle
router.delete('/:id', async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicle = await vehicleRepo.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    await vehicleRepo.remove(vehicle);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// Update vehicle status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const vehicle = await vehicleService.updateVehicleStatus(parseInt(req.params.id), status as Vehicle['status']);
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle status' });
  }
});

// Update fuel level
router.patch('/:id/fuel', async (req, res) => {
  try {
    const { fuelLevel } = req.body;
    const vehicle = await vehicleService.updateFuelLevel(parseInt(req.params.id), fuelLevel);
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fuel level' });
  }
});

// Update mileage
router.patch('/:id/mileage', async (req, res) => {
  try {
    const { mileage } = req.body;
    const vehicle = await vehicleService.updateMileage(parseInt(req.params.id), mileage);
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update mileage' });
  }
});

// Get available vehicles
router.get('/available/list', async (req, res) => {
  try {
    const vehicles = await vehicleService.getAvailableVehicles();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available vehicles' });
  }
});

// Get vehicles by status
router.get('/status/:status', async (req, res) => {
  try {
    const vehicles = await vehicleService.getVehiclesByStatus(req.params.status as Vehicle['status']);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles by status' });
  }
});

// Get vehicle statistics
router.get('/statistics/summary', async (req, res) => {
  try {
    const stats = await vehicleService.getVehicleStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle statistics' });
  }
});

// Get vehicle utilization
router.get('/utilization/overview', async (req, res) => {
  try {
    const utilization = await vehicleService.getVehicleUtilization();
    res.json(utilization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle utilization' });
  }
});

// Check maintenance schedule
router.get('/maintenance/check', async (req, res) => {
  try {
    const maintenanceNeeded = await vehicleService.checkMaintenanceSchedule();
    res.json(maintenanceNeeded);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check maintenance schedule' });
  }
});

// Search vehicles
router.get('/search/:query', async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const query = req.params.query;
    
    const vehicles = await vehicleRepo
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.orders', 'orders')
      .where('vehicle.plateNumber ILIKE :query', { query: `%${query}%` })
      .orWhere('vehicle.model ILIKE :query', { query: `%${query}%` })
      .orWhere('vehicle.vehicleId ILIKE :query', { query: `%${query}%` })
      .orderBy('vehicle.createdAt', 'DESC')
      .getMany();
    
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search vehicles' });
  }
});

// Get vehicle with orders
router.get('/:id/orders', async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicle = await vehicleRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['orders']
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json(vehicle.orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle orders' });
  }
});

export default router;
