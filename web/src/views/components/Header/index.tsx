import { Button } from "@views/components/Button";
import { fetchNui } from "@app/utils/fetchNui";
import { useVisibilityStore } from "@app/stores/Visibility";

export function Header() {
	const { setVisible } = useVisibilityStore(state => state)
	const handleClick = () => {
		setVisible(false)
		fetchNui({ path: "closeNui", payload: {}, mockData: true });
	}

	return (
		<div className="flex flex-col mb-6">
			<div className="flex flex-row justify-between items-center">
				<div className="flex items-center gap-2">
					<div className="w-2 h-2 rounded-full bg-background-purple"></div>
					<h2 className="text-text font-inter text-[1.575rem] font-semibold leading-[2.25rem] tracking-[-0.014rem]">
						Veículos
					</h2>
				</div>
				
				<Button onClick={handleClick}>
				<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fillRule="evenodd" clipRule="evenodd" d="M8.71277 9.77294C9.00567 10.0658 9.48054 10.0658 9.77343 9.77294C10.0663 9.48004 10.0663 9.00517 9.77343 8.71228L6.06114 4.99998L9.77342 1.2877C10.0663 0.994805 10.0663 0.519931 9.77342 0.227038C9.48053 -0.065855 9.00566 -0.065855 8.71276 0.227038L5.00048 3.93932L1.28815 0.226994C0.995258 -0.0658993 0.520385 -0.065899 0.227491 0.226994C-0.0654019 0.519888 -0.0654023 0.994761 0.227491 1.28765L3.93982 4.99998L0.227483 8.71232C-0.065411 9.00521 -0.0654107 9.48009 0.227483 9.77298C0.520376 10.0659 0.995249 10.0659 1.28814 9.77298L5.00048 6.06064L8.71277 9.77294Z" fill="#EAEDF1"/>
				</svg>
				</Button>
			</div> 
		</div>
	);
}