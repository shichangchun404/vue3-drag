import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/theme-chalk/index.css'
import App from './App.vue'
import router from './router'

const test = 123

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')
