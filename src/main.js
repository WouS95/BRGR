import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { projectAuth } from './firebase/config'

// waits with mounting the app until the program knows if a user logged in
let app 
projectAuth.onAuthStateChanged(() => {
    if(!app){
        app = createApp(App).use(router).mount('#app')
    }
})