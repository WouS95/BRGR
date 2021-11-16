import { createRouter, createWebHistory } from 'vue-router'
import Burgers from '../views/restaurants/ingredients/Burgers.vue'
import Breads from '../views/restaurants/ingredients/Breads.vue'
import Toppings from '../views/restaurants/ingredients/Toppings.vue'
import Sauces from '../views/restaurants/ingredients/Sauces.vue'
import Drinks from '../views/restaurants/ingredients/Drinks.vue'
import Sides from '../views/restaurants/ingredients/Sides.vue'

import Restaurant from '../views/restaurants/Restaurant.vue'
import Orders from '../views/restaurants/RestaurantOrders.vue'
import GuestOrders from '../views/guest/GuestOrders.vue'
import GuestOrderDetails from '../views/guest/GuestOrderDetails'
import GuestLogin from '../views/guest/GuestLogin.vue'
const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/restaurant/ingredients/burgers',
    name: 'Burgers',
    component: Burgers
  },
  {
    path: '/restaurant/ingredients/breads',
    name: 'Breads',
    component: Breads
  },
  {
    path: '/restaurant/ingredients/toppings',
    name: 'Toppings',
    component: Toppings
  },
  {
    path: '/restaurant/ingredients/sauces',
    name: 'Sauces',
    component: Sauces
  },
  {
    path: '/restaurant/ingredients/sides',
    name: 'Sides',
    component: Sides
  },
  {
    path: '/restaurant/ingredients/drinks',
    name: 'Drinks',
    component: Drinks
  }, 
  {
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
    path: '/',
    name: 'GuestLogin',
    component: GuestLogin,
    props: true
  }]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router