import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/theme-chalk/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')

console.log('VITE_ENV', import.meta.env.VITE_APP_NAME, import.meta.env.VITE_ENV)
