import { IVehicle } from '../../global/interfaces/IVehicle';
import { BaseModel } from './BaseModel';

export type VehicleData = IVehicle & {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export class Vehicle extends BaseModel {
    private plate: string;
    private model: string;
    private fuel: number;
    private engine: number;
    private body: number;
    private color: IVehicle['color'];
    private customizations: IVehicle['customizations'];
    private owner: string;

    constructor(data: VehicleData) {
        super();
        this.id = data.id;
        this.plate = data.plate;
        this.model = data.model;
        this.fuel = data.fuel;
        this.engine = data.engine;
        this.body = data.body;
        this.color = data.color;
        this.customizations = data.customizations;
        this.owner = data.owner;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    protected getTableName(): string {
        return 'vehicles';
    }

    protected getInsertFields(): string[] {
        return ['plate', 'model', 'fuel', 'engine', 'body', 'color', 'customizations', 'owner'];
    }

    protected getInsertValues(): any[] {
        return [this.plate, this.model, this.fuel, this.engine, this.body, this.color, this.customizations, this.owner];
    }

    protected getUpdateFields(): string[] {
        return ['plate', 'model', 'fuel', 'engine', 'body', 'color', 'customizations', 'owner'];
    }

    protected getUpdateValues(): any[] {
        return [this.plate, this.model, this.fuel, this.engine, this.body, this.color, this.customizations, this.owner];
    }

    public static async createTable(): Promise<void> {
        const sql = `
            CREATE TABLE IF NOT EXISTS vehicles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                owner VARCHAR(100) NOT NULL,
                plate VARCHAR(8) NOT NULL UNIQUE,
                model VARCHAR(50) NOT NULL,
                fuel INT(11) DEFAULT 15,
                engine INT(11) DEFAULT 1000,
                body INT(11) DEFAULT 1000,
                color TEXT NOT NULL DEFAULT '{"primary":[0,0,0],"secondary":[0,0,0]}',
                customizations JSON NOT NULL DEFAULT '{"neoncolor":[0,255,0],"neon":true}',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        await this.query(sql);
    }

    public static async findByPlate(plate: string): Promise<Vehicle | null> {
        const sql = 'SELECT * FROM vehicles WHERE plate = ?';
        const result = await this.query<VehicleData[]>(sql, [plate]);
        return result[0] ? new Vehicle(result[0]) : null;
    }

    public static async findAll(): Promise<Vehicle[]> {
        const sql = 'SELECT * FROM vehicles';
        const result = await this.query<VehicleData[]>(sql);
        return result.map(data => new Vehicle(data));
    }

    public static async findByOwner(owner: string): Promise<Vehicle[]> {
        const sql = 'SELECT * FROM vehicles WHERE owner = ?';
        const result = await this.query<VehicleData[]>(sql, [owner]);
        return result.map(data => new Vehicle(data));
    }

    public async delete(): Promise<void> {
        if (!this.id) return;
        const sql = 'DELETE FROM vehicles WHERE id = ?';
        await BaseModel.query(sql, [this.id]);
    }

    // Getters
    public getPlate(): string {
        return this.plate;
    }

    public getModel(): string {
        return this.model;
    }

    public getColor(): { primary: number[]; secondary: number[] } {
        return this.color;
    }

    public getCustomizations(): any {
        return this.customizations;
    }

    public setPlate(plate: string): void {
        this.plate = plate;
    }

    public setModel(model: string): void {
        this.model = model;
    }

    public setColor(color: { primary: number[]; secondary: number[] } ): void {
        this.color = color;
    }

    public setCustomizations(customizations: any): void {
        this.customizations = customizations;
    }

    public setOwner(owner: string): void {
        this.owner = owner;
    }
} 