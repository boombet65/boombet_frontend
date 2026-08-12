import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import './style.css'
import { useAuthStore } from './stores/auth/authStore.js'

const app = createApp(App)
const pinia = createPinia()


app.use(Toast, {
    position: "bottom-center", // Mahali itakapotokea (mfano: chini katikati)
    timeout: 3000,             // Sekunde 3
    closeOnClick: true
});
app.use(pinia)
app.use(router)

// Initialize auth before mounting
const authStore = useAuthStore()
await authStore.initialize()

app.mount('#app')