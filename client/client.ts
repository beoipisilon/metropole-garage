import { GarageEvents } from './handlers/garageEvents';
import { NuiEvents } from './handlers/nuiEvents';
import { startGarageThread } from './threads/garageThread';
import { VehicleManager } from './core/VehicleManager';
import { cfg } from '../global/config';

const vehicleManager = VehicleManager.getInstance();
GarageEvents.initialize(vehicleManager);
NuiEvents.initialize();

if (cfg?.garages && cfg.garages.length > 0) {
    startGarageThread();
} else {
    console.log('Nenhuma garagem configurada. A thread de garagem não será iniciada.');
}