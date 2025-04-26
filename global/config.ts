import { IGarageLocation } from "../client/interfaces/Garage";

const configPath = "config.json";
const rowData = LoadResourceFile(GetCurrentResourceName(), configPath);

interface Config {
    garages: IGarageLocation[];
}

let cfg: Config | null = null;

if (rowData !== null) {
    try {
        const config: Config = JSON.parse(rowData);
        cfg = config;
    } catch (error) {
        console.error(`[ERROR] Failed to parse config.json: ${error}`);
    }
} else {
    console.error(`[ERROR] Failed to load config.json`);
}

export { cfg };