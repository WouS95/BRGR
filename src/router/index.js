import {
  createRouter,
  createWebHistory
} from 'vue-router'
import Restaurant from '../views/restaurants/Restaurant.vue'
import Orders from '../views/restaurants/RestaurantOrders.vue'
import GuestOrders from '../views/guest/GuestOrders.vue'
import GuestOrderDetails from '../views/guest/GuestOrderDetails.vue'
import GuestLogin from '../views/guest/GuestLogin.vue'
import RestaurantOrderDetails from '../views/restaurants/RestaurantOrderDetails.vue'

const routes = [{
    path: '/restaurant',
    name: 'Restaurant',
    component: Restaurant
  },
  {
    path: '/restaurant/orders',
    name: 'RestaurantOrders',
    component: Orders
  },
  {
    path: '/guest/orders/:tableNr',
    name: 'GuestOrders',
    component: GuestOrders
  },
  {
    path: '/guest/orders/:tableNr/:id',
    name: 'GuestOrderDetails',
    component: GuestOrderDetails,
    props: true
  },
  {
    path: '/guest/login',
    name: 'GuestLogin',
    component: GuestLogin,
    props: true
  },
  {
    path: '/restaurant/orders/:id',
    name: 'RestaurantOrderDetails',
    component: RestaurantOrderDetails
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router