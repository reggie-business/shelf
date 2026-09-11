import './assets/main.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
	theme: {
		defaultTheme: 'light',
	},
	icons: {
		defaultSet: 'mdi',
	},
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
