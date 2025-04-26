import { BaseCommand } from '../models/BaseCommand';
import { Vehicle } from '../models/Vehicle';
import { VehicleManager } from '../services/VehicleManager';

export class SpawnVehicleCommand extends BaseCommand {
    private vehicleManager: VehicleManager;

    constructor() {
        super('car', 'Spawna um veículo da garagem', true, 'spawn.vehicle');
        this.vehicleManager = VehicleManager.getInstance();
    }

    protected async execute(source: number, args: string[]): Promise<void> {
        const plate = args[0];
        if (!plate) {
            emitNet('chat:addMessage', source, {
                color: [255, 0, 0],
                multiline: true,
                args: ['Sistema', 'Você precisa especificar a placa do veículo']
            });
            return;
        }

        try {
            const vehicle = await Vehicle.findByPlate(plate);
            if (!vehicle) {
                emitNet('chat:addMessage', source, {
                    color: [255, 0, 0],
                    multiline: true,
                    args: ['Sistema', 'Veículo não encontrado']
                });
                return;
            }
            
            const coords = GetEntityCoords(GetPlayerPed(source.toString()));
            const coordsFormatted = {
                x: coords[0],
                y: coords[1],
                z: coords[2],
                heading: GetEntityHeading(GetPlayerPed(source.toString()))
            }

            emitNet('garage:spawnVehicle', source, coordsFormatted, vehicle, false);
        } catch (error) {
            console.error('Erro ao spawnar veículo:', error);
            emitNet('chat:addMessage', source, {
                color: [255, 0, 0],
                multiline: true,
                args: ['Sistema', 'Erro ao spawnar veículo']
            });
        }
    }
} 