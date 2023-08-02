import { createApp } from 'vue'
import { createPinia } from 'pinia'
import myPlugin from './plugins/index'

import App from './App.vue'
// import router from './router'

import './assets/base.css'

const app = createApp(App)

app.use(createPinia())

// 添加自定义指令插件
app.use(myPlugin)
// app.use(router)

app.mount('#app')
