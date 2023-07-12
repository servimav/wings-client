/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
		'./node_modules/flowbite/**/*.js'],
	theme: {
		extend: {
			colors: {
				'primary': {
					DEFAULT: '#D06200',
					100: '#FFCC5A',
					300: '#FB8500',
					500: '#D06200',
					700: '#A54000',
					900: '#7E1C00',
				},
				'butterfly-blue': {
					DEFAULT: '#219ebc',
					50: '#e9f5f8',
					100: '#a6d8e4',
					200: '#90cfde',
					300: '#7ac5d7',
					400: '#37a8c3',
					500: '#219ebc',
					600: '#1e8ea9',
					700: '#145f71',
					800: '#114f5e',
					900: '#0d3f4b',
					950: '#072026'
				},
				'sunflower-mango': {
					DEFAULT: '#ffb703',
					50: '#fff1cd',
					100: '#ffdb81',
					200: '#ffd468',
					300: '#ffcd4f',
					400: '#ffc535',
					500: '#ffb703',
					600: '#e6a503',
					700: '#cc9202',
					800: '#b38002',
					900: '#805c02',
					950: '#4c3701'
				}
			}
		}
	},
	plugins: [
		require('flowbite/plugin')
	]
}
