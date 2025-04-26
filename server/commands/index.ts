import { SpawnVehicleCommand } from './SpawnVehicleCommand';
import { DeleteVehicleCommand } from './DeleteVehicleCommand';

export function registerCommands(): void {
    const commands = [
        new SpawnVehicleCommand(),
        new DeleteVehicleCommand()
    ];

    commands.forEach(command => command.register());
} 