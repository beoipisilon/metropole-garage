import { Vehicle } from './models/Vehicle';
import { registerCommands } from './commands';
import { GarageHandler } from './handlers/garageHandler';

on('onResourceStart', async (resourceName: string) => {
    if (GetCurrentResourceName() !== resourceName) return;
    
    try {
        await Vehicle.createTable();        
        registerCommands();
        GarageHandler.initialize();
    } catch (error) {
        console.error('Erro ao inicializar o recurso:', error);
    }
});