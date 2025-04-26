import { oxmysql as MySQL } from "@overextended/oxmysql/MySQL";

export interface QueryResult {
    insertId?: number;
    affectedRows?: number;
}

export abstract class BaseModel {
    protected id?: number;
    protected createdAt?: Date;
    protected updatedAt?: Date;

    protected static async query<T>(sql: string, params: any[] = []): Promise<T> {
        return MySQL.query<T>(sql, params);
    }

    protected static async execute(sql: string, params: any[] = []): Promise<QueryResult> {
        return MySQL.query<QueryResult>(sql, params);
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    protected abstract getTableName(): string;
    protected abstract getInsertFields(): string[];
    protected abstract getInsertValues(): any[];
    protected abstract getUpdateFields(): string[];
    protected abstract getUpdateValues(): any[];

    public async save(): Promise<this> {
        if (this.id) {
            const fields = this.getUpdateFields();
            const values = this.getUpdateValues();
            values.push(this.id);

            const sql = `
                UPDATE ${this.getTableName()} 
                SET ${fields.map(field => `${field} = ?`).join(', ')}
                WHERE id = ?
            `;
            
            await BaseModel.execute(sql, values);
        } else {
            const fields = this.getInsertFields();
            const values = this.getInsertValues();

            const sql = `
                INSERT INTO ${this.getTableName()} (${fields.join(', ')})
                VALUES (${fields.map(() => '?').join(', ')})
            `;

            const result = await BaseModel.execute(sql, values);
            this.id = result.insertId;
        }
        return this;
    }

    public async delete(): Promise<void> {
        if (!this.id) return;
        const sql = `DELETE FROM ${this.getTableName()} WHERE id = ?`;
        await BaseModel.execute(sql, [this.id]);
    }
} 