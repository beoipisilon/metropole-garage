import { IVehicle } from '../../global/interfaces/IVehicle';
import { IGarageLocation } from '../interfaces/Garage';
import { GetClosestVehiclePlayer } from '../utils/vehicleUtils';

const Delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

export class VehicleManager {
    private static instance: VehicleManager;
    private readonly MAX_SPAWN_ATTEMPTS = 3;
    private readonly SPAWN_TIMEOUT = 5000;

    public static getInstance(): VehicleManager {
        if (!VehicleManager.instance) {
            VehicleManager.instance = new VehicleManager();
        }
        return VehicleManager.instance;
    }

    public async spawnVehicle(vehicleData: IVehicle, coords: IGarageLocation['coords'], register: boolean | false): Promise<void> {
        try {
            if (!vehicleData?.plate || !vehicleData?.model || !coords) {
                throw new Error('Dados inválidos para spawnVehicle');
            }

            const modelHash = GetHashKey(vehicleData.model);
            if (IsModelInCdimage(modelHash) === false) {
                throw new Error(`Modelo de veículo inválido: ${vehicleData.model}`);
            }

            let attempts = 0;
            let vehicle: number | null = null;

            while (attempts < this.MAX_SPAWN_ATTEMPTS && !vehicle) {
                try {
                    const model = GetHashKey(vehicleData.model);
                    RequestModel(model);
                    
                    const modelLoaded = await this.waitForModelLoad(model);
                    if (!modelLoaded) {
                        throw new Error('Falha ao carregar modelo do veículo');
                    }

                    vehicle = CreateVehicle(
                        model,
                        coords.x,
                        coords.y,
                        coords.z,
                        coords.heading,
                        true,
                        true
                    );

                    if (!vehicle || !DoesEntityExist(vehicle)) {
                        throw new Error('Falha ao criar veículo');
                    }

                    
                    if (register) {
                        emitNet('garage:registerVehicle', vehicleData.plate, vehicleData.model, VehToNet(vehicle));
                    }

                    await this.setupVehicle(vehicle, vehicleData, register);
                    return;
                } catch (error) {
                    attempts++;
                    console.error(`Tentativa ${attempts} falhou:`, error);
                    if (vehicle) {
                        DeleteEntity(vehicle);
                    }
                    await Delay(1000);
                }
            }

            throw new Error(`Falha ao spawnar veículo após ${this.MAX_SPAWN_ATTEMPTS} tentativas`);
        } catch (error) {
            console.error('Erro ao spawnar veículo:', error);
            emit('chat:addMessage', {
                args: ['Sistema', 'Erro ao spawnar veículo. Tente novamente.']
            });
            throw error;
        }
    }

    private async waitForModelLoad(model: number): Promise<boolean> {
        const startTime = GetGameTimer();
        while (!HasModelLoaded(model)) {
            if (GetGameTimer() - startTime > this.SPAWN_TIMEOUT) {
                return false;
            }
            await Delay(100);
        }
        return true;
    }

    private async setupVehicle(vehicle: number, vehicleData: IVehicle, register: boolean): Promise<void> {
        try {
            SetEntityAsMissionEntity(vehicle, true, true)
            SetVehicleNumberPlateText(vehicle, vehicleData.plate);
            SetVehicleOnGroundProperly(vehicle);
            SetVehRadioStation(vehicle, "OFF");
            SetVehicleDirtLevel(vehicle, 0.0);
            SetVehicleDoorsLocked(vehicle, 2);
            SetVehicleFuelLevel(vehicle, vehicleData.fuel + 0.0);
            SetVehicleEngineHealth(vehicle, vehicleData.engine + 0.0);
            SetVehicleBodyHealth(vehicle, vehicleData.body + 0.0);
            SetModelAsNoLongerNeeded(vehicleData.model);
            SetPedIntoVehicle(PlayerPedId(), vehicle, -1);

            ClearVehicleCustomPrimaryColour(vehicle);
            ClearVehicleCustomSecondaryColour(vehicle);

            if (vehicleData.color) {
                if (typeof vehicleData.color === 'string') {
                    vehicleData.color = JSON.parse(vehicleData.color);
                }
                if (vehicleData.color?.primary) {
                    SetVehicleCustomPrimaryColour(vehicle, vehicleData.color.primary[0], vehicleData.color.primary[1], vehicleData.color.primary[2]);
                }

                if (vehicleData.color?.secondary) {
                    SetVehicleCustomSecondaryColour(vehicle, vehicleData.color.secondary[0], vehicleData.color.secondary[1], vehicleData.color.secondary[2]);
                }
            }

            if (vehicleData.customizations) {
                if (typeof vehicleData.customizations === 'string') {
                    vehicleData.customizations = JSON.parse(vehicleData.customizations);
                }
                await this.setVehicleMods(vehicle, vehicleData.customizations);
            }

        } catch (error) {
            console.error('Erro ao configurar veículo:', error);
            DeleteEntity(vehicle);
            throw error;
        }
    }

    public async deleteVehicle(): Promise<void> {
        try {
            const playerPed = PlayerPedId();
            const playerCoords = GetEntityCoords(playerPed, false);
            
            const vehicle = GetClosestVehicle(
                playerCoords[0],
                playerCoords[1],
                playerCoords[2],
                5.0,
                0,
                127
            );

            if (!vehicle || !DoesEntityExist(vehicle)) {
                throw new Error('Nenhum veículo próximo encontrado');
            }

            SetEntityAsMissionEntity(vehicle, true, true);
            DeleteEntity(vehicle);
        } catch (error) {
            console.error('Erro ao deletar veículo:', error);
            emit('chat:addMessage', {
                args: ['Sistema', 'Erro ao deletar veículo']
            });
            throw error;
        }
    }

    public async despawnVehicle(plate: string): Promise<void> {
        try {
            const { vehHash, vehPlate, veh } = GetClosestVehiclePlayer(20.0);
            if (!vehHash || !vehPlate) {
                throw new Error('Não foi possível encontrar o veículo');
            }

            if (vehPlate.trim().toUpperCase() !== plate.trim().toUpperCase()) {
                throw new Error('Veículo não encontrado');
            }

            emitNet('garage:storeVehicle', veh, vehPlate);

            if (DoesEntityExist(veh)) {
                DeleteEntity(veh);
            }

        } catch (error) {
            console.error('Erro ao despawnar veículo:', error);
            emit('chat:addMessage', {
                args: ['Sistema', 'Erro ao despawnar veículo']
            });
            throw error;
        }
    }

    private async setVehicleMods(vehicle: number, customizations: any): Promise<void> {
        try {
            SetVehicleModKit(vehicle, 0);

            const neonColor = customizations.neoncolor;
            const smokeColor = customizations.smokecolor;
            const perolado = customizations.extracolor?.[1];
            const wheelcolor = customizations.extracolor?.[2];
            const xenonColor = customizations.xenoncolor;
            const plateIndex = customizations.plateindex;
            const windowTint = customizations.windowtint;
            const bulletProofTyres = customizations.bulletProofTyres;

            if (customizations.extracolor && customizations.extracolor.length >= 3) {
                SetVehicleExtraColours(vehicle, perolado, wheelcolor);
            }

            if (neonColor && neonColor.length >= 3) {
                SetVehicleNeonLightsColour(vehicle, neonColor[0], neonColor[1], neonColor[2]);
            }

            SetVehicleXenonLightsColour(vehicle, xenonColor)
            SetVehicleNumberPlateTextIndex(vehicle, plateIndex)
            SetVehicleWindowTint(vehicle, windowTint)
            SetVehicleTyresCanBurst(vehicle, bulletProofTyres)

            
            if (customizations.mods) {
                for (const [modType, modData] of Object.entries(customizations.mods)) {
                    const { mod, variation } = modData as { mod: number, variation: number };
                    if (Number(modType) == 22 || Number(modType) == 18) {
                        if (Number(mod) > 0) {
                            ToggleVehicleMod(vehicle, Number(modType), true);
                        } else {
                            ToggleVehicleMod(vehicle, Number(modType), false);
                        }
                    } else if (Number(modType) == 20 && smokeColor && smokeColor.length >= 4) {
                        const r = parseInt(smokeColor[1]);
                        const g = parseInt(smokeColor[2]);
                        const b = parseInt(smokeColor[3]);
                        SetVehicleTyreSmokeColor(vehicle, r, g, b);
                    } else if (Number(modType) == 23 || Number(modType) == 24) {
                        SetVehicleMod(vehicle, Number(modType), Number(mod), Boolean(Number(variation)));
                    } else {
                        SetVehicleMod(vehicle, Number(modType), Number(mod), false);
                    }
                }
            }
            
            for (let i = 0; i < 4; i++) {
                SetVehicleNeonLightEnabled(vehicle, i, customizations.neon ?? false);
            }
        } catch (error) {
            console.error('Erro ao aplicar mods do veículo:', error);
            throw error;
        }
    }
} 