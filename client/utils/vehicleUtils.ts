export function GetClosestVehiclePlayer(range: number) {
    const ped = PlayerPedId();
    const vehicles = GetGamePool("CVehicle");
    const [pedX, pedY, pedZ] = GetEntityCoords(ped, false);

    let veh;
    let min = range + 0.0001;
    let vehHash;
    let vehPlate;

    for (const vehicle of vehicles) {
        const [vehX, vehY, vehZ] = GetEntityCoords(vehicle, false);
        const dist = GetDistanceBetweenCoords(pedX, pedY, pedZ, vehX, vehY, vehZ, true);

        if (IsEntityAVehicle(vehicle) && dist <= range) {
            if (dist < min) {
                min = dist;
                veh = vehicle;
                vehHash = GetEntityModel(vehicle);
                vehPlate = GetVehicleNumberPlateText(vehicle);
            }
        }
    }

    return { vehHash, vehPlate, veh };
} 