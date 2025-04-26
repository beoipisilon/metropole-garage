import { useVisibilityStore } from "@app/stores/Visibility";
import { useNuiMessage } from "@app/hooks/useNuiMessage";
import { Header } from "@views/components/Header";
import { Garage } from "@views/pages/Garage";

import { fetchNui } from "@app/utils/fetchNui";
import { useKeyPress } from '@app/hooks/useKeyPress';

import { AnimatedDiv } from "@app/utils/misc";
import { AnimatePresence } from "motion/react";
import { useGarage } from "@app/stores/Garage";
import { useShallow } from "zustand/shallow";
import { Vehicle } from "@app/interfaces/Vehicle";

export function Layout() {	
	const { visible, setVisible } = useVisibilityStore(state => state)
	const { setVehicles } = useGarage(
		useShallow((state) => ({
			setVehicles: state.setVehicles,
		})),
	);

	useNuiMessage('setVisible', async (payload: { visible: boolean, vehicles?: any }) => {
		setVisible(payload.visible)
		if (payload.vehicles) {
			const vehicles = payload.vehicles.map((vehicle: Vehicle & { color: string }) => ({
				...vehicle,
				color: JSON.parse(vehicle.color)
			}))
			setVehicles(vehicles)
		}
	})

	useKeyPress('Escape', () => {
		setVisible(false)
		fetchNui({ path: "closeNui", payload: {}, mockData: true });
	});

	return (
		<AnimatePresence>
			{visible && (
				<AnimatedDiv className="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 z-[2] flex w-[860px] flex-col gap-2">
					<main className="w-full rounded-lg bg-gradient-to-br from-background via-background/90 to-background/80 p-8">
						<Header />
						<Garage />
					</main>
				</AnimatedDiv>
			)}
		</AnimatePresence>
	);
}
