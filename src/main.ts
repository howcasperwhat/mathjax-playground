import FloatingVue from 'floating-vue'
import { createApp } from 'vue'
import App from './App.vue'

import 'floating-vue/dist/style.css'
import './styles/main.css'
import './styles/theme.css'
import './styles/message.css'
import './styles/tooltip.css'
import 'uno.css'

const app = createApp(App)
app.use(FloatingVue)
app.mount('#app')
