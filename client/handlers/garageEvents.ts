import { VehicleManager } from '../core/VehicleManager';
import { IVehicle } from '../../global/interfaces/IVehicle';
import { IGarageLocation } from '../interfaces/Garage';

export class GarageEvents {
    private static vehicleManager: VehicleManager;
    public static initialize(vehicleManager: VehicleManager): void {
        this.vehicleManager = vehicleManager;

        onNet('garage:spawnVehicle', async (coords: IGarageLocation['coords'], vehicle: IVehicle, register: boolean = false) => {
            try {
                if (!coords || !vehicle?.plate || !vehicle.model) {
                    console.error('Dados inválidos para spawnVehicle:', { coords, vehicle });
                    return;
                }

                
                await this.vehicleManager.spawnVehicle(vehicle, coords, register);
            } catch (error) {
                console.error('Erro ao spawnar veículo:', error);
            }
        });

        onNet('garage:deleteVehicle', async () => {
            await this.vehicleManager.deleteVehicle()
        })
    }
} 