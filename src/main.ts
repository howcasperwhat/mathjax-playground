import FloatingVue from 'floating-vue'
import { createApp } from 'vue'
import App from './App.vue'

import 'floating-vue/dist/style.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
app.use(FloatingVue)
app.mount('#app')
