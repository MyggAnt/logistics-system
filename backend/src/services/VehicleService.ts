import { AppDataSource } from '../data-source';
import { Vehicle } from '../entities/Vehicle';
import { Order } from '../entities/Order';
import { Notification } from '../entities/Notification';

export class VehicleService {
  private vehicleRepo = AppDataSource.getRepository(Vehicle);
  private orderRepo = AppDataSource.getRepository(Order);
  private notificationRepo = AppDataSource.getRepository(Notification);

  async createVehicle(vehicleData: Partial<Vehicle>) {
    const vehicle = this.vehicleRepo.create(vehicleData);
    const savedVehicle: Vehicle = await this.vehicleRepo.save(vehicle);

    // Create notification for new vehicle
    await this.createNotification(
      'info',
      'Новое транспортное средство',
      `Добавлено новое транспортное средство ${savedVehicle.plateNumber} (${savedVehicle.model})`,
      { text: 'Просмотреть ТС', vehicleId: savedVehicle.id },
      { vehicleId: savedVehicle.id }
    );

    return savedVehicle;
  }

  async updateVehicleStatus(vehicleId: number, status: Vehicle['status']) {
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId } });
    if (!vehicle) throw new Error('Vehicle not found');

    await this.vehicleRepo.update({ id: vehicleId }, { status });
    const updatedVehicle = await this.vehicleRepo.findOne({
      where: { id: vehicleId },
      relations: ['orders']
    });

    if (!updatedVehicle) throw new Error('Vehicle not found after update');

    // Create notification for status change
    const statusMessages = {
      'available': 'Транспортное средство доступно',
      'in_use': 'Транспортное средство в использовании',
      'maintenance': 'Транспортное средство на обслуживании',
      'out_of_service': 'Транспортное средство неисправно'
    };

    if (statusMessages[status as keyof typeof statusMessages]) {
      await this.createNotification(
        status === 'available' ? 'success' : status === 'out_of_service' ? 'error' : 'warning',
        statusMessages[status as keyof typeof statusMessages],
        `${vehicle.plateNumber} ${statusMessages[status as keyof typeof statusMessages].toLowerCase()}`,
        { text: 'Просмотреть ТС', vehicleId: updatedVehicle.id },
        { vehicleId: updatedVehicle.id }
      );
    }

    return updatedVehicle;
  }

  async updateFuelLevel(vehicleId: number, fuelLevel: number) {
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId } });
    if (!vehicle) throw new Error('Vehicle not found');

    await this.vehicleRepo.update({ id: vehicleId }, { fuelLevel });
    const updatedVehicle = await this.vehicleRepo.findOne({
      where: { id: vehicleId },
      relations: ['orders']
    });

    if (!updatedVehicle) throw new Error('Vehicle not found after update');

    // Create notification for low fuel
    if (fuelLevel < 20) {
      await this.createNotification(
        'warning',
        'Низкий уровень топлива',
        `Транспортное средство ${vehicle.plateNumber} имеет уровень топлива менее 20%`,
        { text: 'Просмотреть ТС', vehicleId: updatedVehicle.id },
        { vehicleId: updatedVehicle.id }
      );
    }

    return updatedVehicle;
  }

  async updateMileage(vehicleId: number, mileage: number) {
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId } });
    if (!vehicle) throw new Error('Vehicle not found');

    await this.vehicleRepo.update({ id: vehicleId }, { mileage });
    const updatedVehicle = await this.vehicleRepo.findOne({
      where: { id: vehicleId },
      relations: ['orders']
    });

    if (!updatedVehicle) throw new Error('Vehicle not found after update');

    // Check if maintenance is needed
    if (mileage - vehicle.mileage > 10000) {
      await this.createNotification(
        'warning',
        'Требуется обслуживание',
        `Транспортное средство ${vehicle.plateNumber} требует планового обслуживания`,
        { text: 'Просмотреть ТС', vehicleId: updatedVehicle.id },
        { vehicleId: updatedVehicle.id }
      );
    }

    return updatedVehicle;
  }

  async getAvailableVehicles() {
    return await this.vehicleRepo.find({
      where: { status: 'available' as Vehicle['status'] },
      relations: ['orders'],
      order: { createdAt: 'DESC' }
    });
  }

  async getVehiclesByStatus(status: Vehicle['status']) {
    return await this.vehicleRepo.find({
      where: { status },
      relations: ['orders'],
      order: { createdAt: 'DESC' }
    });
  }

  async getVehicleStatistics() {
    const vehicles = await this.vehicleRepo.find();

    return {
      total: vehicles.length,
      available: vehicles.filter(v => v.status === 'available').length,
      inUse: vehicles.filter(v => v.status === 'in_use').length,
      maintenance: vehicles.filter(v => v.status === 'maintenance').length,
      outOfService: vehicles.filter(v => v.status === 'out_of_service').length,
    };
  }

  async checkMaintenanceSchedule() {
    const vehicles = await this.vehicleRepo.find();
    const today = new Date();
    const maintenanceNeeded = vehicles.filter(vehicle => {
      const nextMaintenance = new Date(vehicle.nextMaintenance);
      const daysUntilMaintenance = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilMaintenance <= 7;
    });

    for (const vehicle of maintenanceNeeded) {
      await this.createNotification(
        'warning',
        'Требуется обслуживание',
        `Транспортное средство ${vehicle.plateNumber} требует обслуживания через ${Math.ceil((new Date(vehicle.nextMaintenance).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} дней`,
        { text: 'Просмотреть ТС', vehicleId: vehicle.id },
        { vehicleId: vehicle.id }
      );
    }

    return maintenanceNeeded;
  }

  async getVehicleUtilization() {
    const vehicles = await this.vehicleRepo.find();
    const totalVehicles = vehicles.length;
    const inUseVehicles = vehicles.filter(v => v.status === 'in_use').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;

    return {
      total: totalVehicles,
      inUse: inUseVehicles,
      maintenance: maintenanceVehicles,
      utilizationRate: totalVehicles > 0 ? ((inUseVehicles + maintenanceVehicles) / totalVehicles) * 100 : 0
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
