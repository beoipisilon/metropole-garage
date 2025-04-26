export abstract class BaseCommand {
    protected name: string;
    protected description: string;
    protected restricted: boolean;
    protected permission: string;

    constructor(name: string, description: string, restricted: boolean = false, permission: string = '') {
        this.name = name;
        this.description = description;
        this.restricted = restricted;
        this.permission = permission;
    }

    public register(): void {
        RegisterCommand(this.name, (source: number, args: string[]) => {
            if (!source) {
                console.error('Source inválido');
                return;
            }

            if (this.restricted && !this.hasPermission(source, this.permission)) {
                emitNet('chat:addMessage', source, {
                    color: [255, 0, 0],
                    multiline: true,
                    args: ['Sistema', 'Você não tem permissão para usar este comando']
                });
                return;
            }

            this.execute(source, args);
        }, false);
    }

    protected hasPermission(source: number, permission: string): boolean {
        if (!source) return false;
        
        return IsPlayerAceAllowed(source.toString(), permission);
    }

    protected abstract execute(source: number, args: string[]): void;
} 