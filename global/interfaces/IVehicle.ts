export interface IVehicle {
    plate: string;
    model: string;
    color: {
        primary: number[];
        secondary: number[];
    };
    owner: string;
    customizations: {
        mods: {
            [key: string]: {
                mod: number;
                variation: number;
            }
        };
        neoncolor?: number[];
        smokecolor?: number[];
        bulletProofTyres?: boolean;
    };
    fuel: number;
    engine: number;
    body: number;
    stored: boolean;
} 