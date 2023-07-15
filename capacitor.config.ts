import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.servimav.wings',
	appName: 'Wings',
	webDir: 'dist',
	server: {
		// androidScheme: 'https',
		url: 'http://192.168.1.66:5173/'
	}
};

export default config;
