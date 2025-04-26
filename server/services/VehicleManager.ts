import { Vehicle } from "../models/Vehicle";

export class VehicleManager {
    private static instance: VehicleManager;
    private vehicles: Map<string, boolean> = new Map();

    private constructor() {}

    public static getInstance(): VehicleManager {
        if (!VehicleManager.instance) {
            VehicleManager.instance = new VehicleManager();
        }
        return VehicleManager.instance;
    }

    isVehicleInGarage(plate: string): boolean {
        const targetPlate = plate.trim().toUpperCase();
    
        for (const vehicle of GetAllVehicles() as number[]) {
            if (DoesEntityExist(vehicle) && 
                GetVehicleNumberPlateText(vehicle).trim().toUpperCase() === targetPlate) {
                return Entity(vehicle).state.garage?.stored ?? true;
            }
        }
        return true;
    }

    registerVehicle(source: string, plate: string, model: string, netId: number, customizations: any) {
        if (!source || !plate || !model || !netId) return

        const entity = NetworkGetEntityFromNetworkId(netId);
        if (!DoesEntityExist(entity)) {
            return;
        }

        Entity(entity).state.set('garage', {
            owner: GetPlayerIdentifierByType(source, 'steam').split(':')[1],
            plate: plate,
            model: model,
            stored: false,
            customizations: JSON.parse(customizations),
            lastUpdate: Date.now()
        }, true);

        console.log('Veículo registrado com sucesso!', netId);
    } 

    setVehicleState(plate: string, inGarage: boolean) {
        this.vehicles.set(plate, inGarage);
    }

    storeVehicle(netId: number, plate: string) {
        if (!netId) return
        this.setVehicleState(plate, true);

        const entity = NetworkGetEntityFromNetworkId(netId);
        if (!DoesEntityExist(entity)) {
            return;
        }

        const state = Entity(entity).state.garage;
        if (state) {
            Entity(entity).state.garage.stored = true;
            console.log('Veiculo armazenado com sucesso');
        }
    }
} 