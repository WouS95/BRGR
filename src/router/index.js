import {
  createRouter,
  createWebHistory
} from 'vue-router'
import {
  projectAuth
} from '../firebase/config'
import Restaurant from '../views/restaurants/RestaurantWelcome.vue'
import Orders from '../views/restaurants/RestaurantOrders.vue'
import GuestOrders from '../views/guest/GuestOrders.vue'
import GuestOrderDetails from '../views/guest/GuestOrderDetails.vue'
import GuestLogin from '../views/guest/GuestLogin.vue'
import RestaurantOrderDetails from '../views/restaurants/RestaurantOrderDetails.vue'
import RestaurantEditOrder from '../views/restaurants/RestaurantEditOrder.vue'
import PathNotFound from '../views/PathNotFound.vue'
import Ingredients from '../views/restaurants/RestaurantEditIngredients'

const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if (!user) {
    next({
      name: 'Restaurant'
    })
  } else {
    next()
  }
}

const routes = [{
    // RESTAURANT PATHS
    path: '/restaurant',
    name: 'Restaurant',
    component: Restaurant,
  },
  {
    path: '/restaurant/orders',
    name: 'RestaurantOrders',
    component: Orders,
    beforeEnter: requireAuth
  },
  {
    path: '/restaurant/orders/:id',
    name: 'RestaurantOrderDetails',
    component: RestaurantOrderDetails,
    beforeEnter: requireAuth
  },
  {
    path: '/restaurant/ingredients',
    name: 'Ingredients',
    component: Ingredients,
    beforeEnter: requireAuth
  },
  {
    path: '/restaurant/orders/:id/edit',
    name: 'RestaurantEditOrder',
    component: RestaurantEditOrder,
    beforeEnter: requireAuth
  },


  // GUEST PATHS
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
  },
  {
    path: '/:catchAll(.*)',
    name: 'PathNotFound',
    component: PathNotFound
},
{
    path: '/guest',
    name: 'guest',
    redirect: {
      name: 'GuestLogin'
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes, 
})

export default router