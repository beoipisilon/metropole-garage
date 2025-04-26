import { isEnvBrowser } from "@app/utils/misc";
import React from "react";
import ReactDOM from "react-dom/client";

import { Layout } from "@views/layout";

import "@views/styles/fonts/stylesheet.css";
import "@views/styles/index.css";

if (isEnvBrowser()) {
	const body = document.getElementById("root");

	body!.style.backgroundImage = "url('https://files.catbox.moe/axhlmn.png')";
	body!.style.backgroundSize = "cover";
	body!.style.backgroundRepeat = "no-repeat";
	body!.style.backgroundPosition = "center";
	body!.style.height = "100vh";
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Layout />
	</React.StrictMode>,
);
