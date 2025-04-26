import clsx from "clsx";
import useSound from "use-sound";

import ClickSound from "@views/assets/sounds/click.mp3";

import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    const [playClickSound] = useSound(ClickSound, { volume: 0.07 });

	return (
		<button
			{...props}
			onClick={(e) => {
				playClickSound();
				props.onClick && props.onClick(e);
			}}
			style={props.style}
			className={clsx("will-change-transform ", props.className)}
		/>
	);
}
