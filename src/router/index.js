import {
  createRouter,
  createWebHistory
} from 'vue-router'
import Restaurant from '../views/restaurants/Restaurant.vue'
import Orders from '../views/restaurants/RestaurantOrders.vue'
import GuestOrders from '../views/guest/GuestOrders.vue'
import NewOrder from '../views/guest/GuestCreateOrder.vue'

const routes = [{
    path: '/restaurant',
    name: 'Restaurant',
    component: Restaurant
  },
  {
    path: '/restaurant/orders',
    name: 'Orders',
    component: Orders
  },
  {
    path: '/guest/orders',
    name: 'GuestOrders',
    component: GuestOrders
  },
  {
    path: '/guest/new-order',
    name: 'NewOrder',
    component: NewOrder
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router