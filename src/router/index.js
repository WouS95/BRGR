import { createRouter, createWebHistory } from 'vue-router'
import GuestOrders from '../views/guest/GuestOrders.vue'

const routes = [
  {
    path: '/guest-orders',
    name: 'GuestOrders',
    component: GuestOrders
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
