export interface IGarageLocation {
    coords: { x: number; y: number; z: number; heading: number };
    radius: number;
    name: string;
    spawnLocations: { x: number; y: number; z: number; heading: number }[]; 
}