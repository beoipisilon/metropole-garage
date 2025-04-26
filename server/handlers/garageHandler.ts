import { IVehicle } from '../../global/interfaces/IVehicle';
import { VehicleManager } from '../services/VehicleManager';
import { Vehicle } from '../models/Vehicle';

export class GarageHandler {
    public static initialize(): void {
        onNet('garage:openMenu', async () => {
            const source = global.source;
            const steam = GetPlayerIdentifierByType(source.toString(), 'steam').split(':')[1];

            try {
                const playerVehicles = await Vehicle.findByOwner(steam) || [];
                emitNet('garage:receiveVehicles', source, playerVehicles);
            } catch (error) {
                console.error('Erro ao buscar veículos:', error);
            }
        });

        onNet('garage:checkStoredStatus', async (vehicle: IVehicle, coords: any) => {
            if (!vehicle?.plate) {
                return 
            }
        
            try {
                const isSpawned = VehicleManager.getInstance().isVehicleInGarage(vehicle.plate);
        
                if (!isSpawned) {
                    console.log('Veículo fora da garagem');
                    return
                }
        
                emitNet('garage:closeNui', global.source)
                emitNet('garage:spawnVehicle', global.source, coords, vehicle, true);
            } catch (error) {
                console.error('Erro ao verificar o estado do veículo:', error);
            }
        });

        onNet('garage:storeVehicle', async (vehicle: number, plate: string) => {
            if (!vehicle) return

            VehicleManager.getInstance().storeVehicle(vehicle, plate);
        });

        onNet('garage:registerVehicle', async (plate: string, model: string, netId: number) => {
            const source = global.source;
            if (!model || !netId) return
        
            const vehicleExists = await Vehicle.findByPlate(plate);
            if (!vehicleExists) {
                return console.log(`Veículo ${plate} não registrado no banco`);
            }
                
            VehicleManager.getInstance().registerVehicle(source.toString(), plate, model, netId, vehicleExists.getCustomizations());
        });
    }
} 