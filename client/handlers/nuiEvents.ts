import { VehicleManager } from '../core/VehicleManager';
import { IVehicle } from '../../global/interfaces/IVehicle';
import { currentGarage } from '../threads/garageThread';

export class NuiEvents {
    public static initialize(): void {
        onNet('garage:receiveVehicles', (vehicles: any[]) => {
            if (!currentGarage) return;

            SetNuiFocus(true, true);

            SendNUIMessage({
                action: 'setVisible',
                payload: {
                    visible: true,
                    vehicles: vehicles
                }
            });
        });

        onNet('garage:closeNui', async () => {
            SetNuiFocus(false, false);
            SendNUIMessage({
                action: 'setVisible',
                payload: {
                    visible: false,
                }
            });
        });

        RegisterNuiCallback('spawnVehicle', async (data: { vehicle: IVehicle }, cb: (result: { success: boolean }) => void) => {
            const vehicle = data.vehicle;
            const spawnCoords = currentGarage?.spawnLocations;

            if (!spawnCoords) {
                console.log('Nenhuma vaga de spawn disponível');
                return cb({ success: false });
            }

            const radius = 3.0;
            for (const coord of spawnCoords) {
                if (!IsAnyVehicleNearPoint(coord.x, coord.y, coord.z, radius)) {
                    emitNet('garage:checkStoredStatus', vehicle, coord);
                    return;
                }
            }

            console.log('Não há vagas próximas para spawnar');
            return cb({ success: false });
        });

        RegisterNuiCallback('storeVehicle', async (data: { vehicle: { plate: string } }) => {
            VehicleManager.getInstance().despawnVehicle(data.vehicle.plate)
        });

        RegisterNuiCallback('closeNui', async () => {
            SetNuiFocus(false, false);
            SendNUIMessage({
                action: 'setVisible',
                payload: {
                    visible: false,
                }
            });
        });
    }
} 