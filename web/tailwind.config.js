module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		extend: {
			colors: {
				background: {
					DEFAULT: 'rgb(16,16,23)',
					card: 'rgba(26,26,27,0.5)',
					purple: 'rgb(120,121,237)',
				},
				border: {
					DEFAULT: 'rgb(120,121,237)',
				},
				text: {
					DEFAULT: 'rgb(119,119,121)',
					light: 'rgba(255,255,255,0.8)'
				},
				button: {
					from: 'rgb(183,117,236)',
					to: 'rgb(163,97,216)',
					shadow: 'rgba(183,117,236,0.4)'
				}
			},
		},
	},
};
