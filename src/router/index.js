import {
  createRouter,
  createWebHistory
} from 'vue-router'
import { projectAuth } from '../firebase/config'
import Burgers from '../views/restaurants/ingredients/Burgers.vue'
import Breads from '../views/restaurants/ingredients/Breads.vue'
import Toppings from '../views/restaurants/ingredients/Toppings.vue'
import Sauces from '../views/restaurants/ingredients/Sauces.vue'
import Drinks from '../views/restaurants/ingredients/Drinks.vue'
import Sides from '../views/restaurants/ingredients/Sides.vue'
import Restaurant from '../views/restaurants/Restaurant.vue'
import Orders from '../views/restaurants/RestaurantOrders.vue'
import GuestOrders from '../views/guest/GuestOrders.vue'
import GuestOrderDetails from '../views/guest/GuestOrderDetails.vue'
import GuestLogin from '../views/guest/GuestLogin.vue'
import RestaurantOrderDetails from '../views/restaurants/RestaurantOrderDetails.vue'

const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if (!user) {
    next({ name: 'Restaurant' })
  } else {
    next()
  }
}

const routes = [{
    path: '/restaurant',
    name: 'Restaurant',
    component: Restaurant
  },
  {
    path: '/restaurant/orders',
    name: 'RestaurantOrders',
    component: Orders,
    beforeEnter: requireAuth
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
    component: RestaurantOrderDetails,
    beforeEnter: requireAuth
  },
  {
    path: '/restaurant/ingredients/breads',
    name: 'Breads',
    component: Breads
  },
  {
    path: '/restaurant/ingredients/burgers',
    name: 'Burgers',
    component: Burgers,
    beforeEnter: requireAuth
  },
  {
    path: '/restaurant/ingredients/drinks',
    name: 'Drinks',
    component: Drinks,
    beforeEnter: requireAuth
  },
  {
    path: '/restaurant/ingredients/sides',
    name: 'Sides',
    component: Sides
  },
  {
    path: '/restaurant/ingredients/sauces',
    name: 'Sauces',
    component: Sauces,
    beforeEnter: requireAuth
  },
  {
    path: '/restaurant/ingredients/toppings',
    name: 'Toppings',
    component: Toppings,
    beforeEnter: requireAuth
  },
  {
    path: '/ingredients',
    name: 'Ingredients',
    redirect: { name: 'Burgers'},
    beforeEnter: requireAuth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router