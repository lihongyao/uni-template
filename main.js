import App from '@/App'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia';
import { useStore } from '@/stores';

export function createApp() {
	const app = createSSRApp(App)
	app.use(createPinia()); // → 注入store
	return {
		app
	}
}