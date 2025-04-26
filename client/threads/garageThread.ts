import { cfg } from '../../global/config';
import { IGarageLocation } from '../interfaces/Garage';
import { DrawText3D } from '../utils/other';

export let currentGarage: IGarageLocation | null = null;
let isNearGarage = false;

export function startGarageThread() {
    setTick(() => {
        const playerPed = PlayerPedId();
        const playerCoords = GetEntityCoords(playerPed, false);
        
        for (const garage of cfg?.garages || []) {
            const distance = GetDistanceBetweenCoords(
                playerCoords[0],
                playerCoords[1],
                playerCoords[2],
                garage.coords.x,
                garage.coords.y,
                garage.coords.z,
                true
            );

            if (distance <= garage.radius) {
                if (!isNearGarage) {
                    isNearGarage = true;
                    currentGarage = garage;
                }
                DrawText3D(
                    garage.coords.x,
                    garage.coords.y,
                    garage.coords.z + 0.5,
                    `~w~[~g~E~w~] ${garage.name}`
                );
                break;
            } else if (isNearGarage && currentGarage === garage) {
                isNearGarage = false;
                currentGarage = null;
            }
        }

        if (isNearGarage && IsControlJustPressed(0, 38)) {
            emitNet('garage:openMenu');
        }
    });
} 