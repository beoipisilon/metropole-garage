import { fetchNui } from "@app/utils/fetchNui";
import { create } from "zustand";
import { Vehicle } from "@app/interfaces/Vehicle";

export interface GarageStore {
    vehicles: Vehicle[];    
}

export interface GarageActions {
    spawnVehicle: (vehicle: Vehicle) => Promise<void>;
    storeVehicle: (vehicle: Vehicle) => Promise<void>;
    setVehicles: (vehicles: Vehicle[]) => void;
    resetStore: () => void;
}

const initialState: GarageStore = {
    vehicles: [],
};

export const useGarage = create<GarageStore & GarageActions>()((set) => ({
    ...initialState,

    async spawnVehicle(vehicle: Vehicle) {
        try {
            await fetchNui({
                path: "spawnVehicle",
                payload: { vehicle },
                mockData: { success: true },
            });
        } catch (error) {
            console.error("Failed to spawn vehicle:", error);
        }
    },

    async storeVehicle(vehicle: Vehicle) {
        try {
            await fetchNui({
                path: "storeVehicle",
                payload: { vehicle },
                mockData: { success: true },
            });
        } catch (error) {
            console.error("Failed to store vehicle:", error);
        }
    },
    
    setVehicles(vehicles: Vehicle[]) {
        set({ vehicles: [...vehicles] });
    },

    resetStore() {
        set({ ...initialState });
    },
}));