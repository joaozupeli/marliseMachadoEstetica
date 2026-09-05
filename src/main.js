import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { startMotion } from './composables/useMotion'
import 'lenis/dist/lenis.css'
import './assets/styles/base.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

startMotion()
