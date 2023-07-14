import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import router from './router'
const head = createHead()

const app = createApp(App)
app.use(head)

app.use(createPinia())
app.use(router)

app.mount('#app')

registerSW({
  immediate: true
  // onNeedRefresh() {},
  // onOfflineReady() {},
})
