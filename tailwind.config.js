/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
		'./node_modules/flowbite/**/*.js'],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			white: colors.white,
			black: colors.black,
			'gray': colors.gray,
			green: colors.green,
			'primary': {
				DEFAULT: '#e8554f',
				'light': '#f4aaa7',
				'dark': '#d14d47',
			},
		}
	},
	plugins: [
		require('flowbite/plugin')
	]
}
