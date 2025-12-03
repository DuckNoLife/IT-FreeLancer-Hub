import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

// Import Bootstrap CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)

app.use(router)

// Google Login configuration
app.use(vue3GoogleLogin, {
    clientId: '135554645708-7vkbacotvftaafe7pr3ocuk7t4f0u20j.apps.googleusercontent.com' 
})

app.mount('#app')