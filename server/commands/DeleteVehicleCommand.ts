import { BaseCommand } from '../models/BaseCommand';

export class DeleteVehicleCommand extends BaseCommand {
    constructor() {
        super('delveh', 'Deleta um veículo da garagem', true, 'delete.vehicle');
    }

    protected async execute(source: number): Promise<void> {
        if (!source || source <= 0) {
            console.log('Nao foi possivel deletar o veiculo');
            return;
        }

        emitNet('garage:deleteVehicle', source);
    }
} 