import {
  createRouter,
  createWebHistory
} from 'vue-router'
import Restaurant from '../views/restaurants/RestaurantWelcome.vue'
import Orders from '../views/restaurants/RestaurantOrders.vue'
import GuestOrders from '../views/guest/GuestOrders.vue'

const routes = [{
    // RESTAURANT PATHS
    path: '/restaurant/login',
    name: 'Restaurant',
    component: Restaurant
  },
  {
    path: '/restaurant/orders',
    name: 'Orders',
    component: Orders
  },


  // GUEST PATHS
  {
    path: '/guest/orders',
    name: 'GuestOrders',
    component: GuestOrders
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router