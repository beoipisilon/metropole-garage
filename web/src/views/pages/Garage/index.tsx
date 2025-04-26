import { useEffect } from 'react';
import { Button } from '@views/components/Button';
import { useShallow } from 'zustand/shallow';
import { useGarage } from '@app/stores/Garage';

export function Garage() {
	const { vehicles, spawnVehicle, storeVehicle } = useGarage(
		useShallow((state) => ({
			vehicles: state.vehicles,
			spawnVehicle: state.spawnVehicle,
			storeVehicle: state.storeVehicle,
		})),
	);

	return (
		<div className="h-[35rem] overflow-y-auto hideScroll">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{vehicles.map((vehicle) => (
					<div key={vehicle.id}>
						<div className="relative h-40 p-4 border-2 border-border rounded-lg">
							<img 
								src={`https://docs.fivem.net/vehicles/${vehicle.model}.webp`}
								alt={vehicle.model}
								className="w-full h-full object-contain"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = 'https://docs.fivem.net/vehicles/default.webp';
								}}
							/>
						</div>
						<div className="py-4">
							<p className="text-sm text-text mb-2 font-semibold">Informações do veículo</p>
							<div className="grid grid-cols-3 gap-2 mb-4 bg-background-card rounded-lg px-3 py-2">
								<div className="flex flex-col gap-1 items-start">
									<p className="text-xs text-text">Modelo</p>
									<span className="text-sm text-text-light font-medium truncate">{vehicle.model}</span>
								</div>
								<div className="flex flex-col gap-1 items-start">
									<p className="text-xs text-text">Placa</p>
									<span className="text-sm text-text-light font-medium">{vehicle.plate}</span>
								</div>
								<div className="flex flex-col gap-1 items-start">
									<p className="text-xs text-text">Cor</p>
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 rounded-sm" style={{ backgroundColor: `rgb(${vehicle.color.primary[0]}, ${vehicle.color.primary[1]}, ${vehicle.color.primary[2]})` }} />
										<div className="w-4 h-4 rounded-sm" style={{ backgroundColor: `rgb(${vehicle.color.secondary[0]}, ${vehicle.color.secondary[1]}, ${vehicle.color.secondary[2]})` }} />
									</div>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<Button
									onClick={() => spawnVehicle(vehicle)}
									className="relative py-2 px-4 bg-gradient-to-r from-button-from to-button-to text-white rounded-md text-sm font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.button.shadow)] hover:scale-[1.02] active:scale-[0.98]"
								>
									<span className="relative z-10">Spawnar</span>
									<div className="absolute inset-0 bg-gradient-to-r from-button-to to-button-from opacity-0 hover:opacity-100 transition-opacity duration-300" />
								</Button>
								<Button
									onClick={() => {storeVehicle(vehicle)}}
									className="relative py-2 px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-md text-sm font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.pink.500)] hover:scale-[1.02] active:scale-[0.98]"
								>
									<span className="relative z-10">Guardar</span>
									<div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}