export interface Vehicle {
	id: number;
	model: string;
	color: {
		primary: number[];
		secondary: number[];
	};
	plate: string;
}