import { AppDataSource } from './data-source';
import { Vehicle } from './entities/Vehicle';

async function testVehicleCreation() {
  try {
    await AppDataSource.initialize();
    
    const vehicle = new Vehicle();
    vehicle.vehicleId = 'VEH-001';
    vehicle.plateNumber = 'А123БВ777';
    vehicle.model = 'Tesla Model 3';
    vehicle.capacity = 1500;
    vehicle.status = 'available';
    vehicle.lastMaintenance = new Date(); // Обязательное поле
    vehicle.nextMaintenance = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 дней
    vehicle.fuelLevel = 100;
    vehicle.mileage = 0;
    
    await AppDataSource.manager.save(vehicle);
    console.log('✅ Транспорт успешно создан!');
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

testVehicleCreation();