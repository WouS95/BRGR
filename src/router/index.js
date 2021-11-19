import {
  createRouter,
  createWebHistory
} from 'vue-router'
import {
  projectAuth
} from '../firebase/config'
import Burgers from '../views/restaurants/ingredients/Burgers.vue'
import Breads from '../views/restaurants/ingredients/Breads.vue'
import Toppings from '../views/restaurants/ingredients/Toppings.vue'
import Sauces from '../views/restaurants/ingredients/Sauces.vue'
import Drinks from '../views/restaurants/ingredients/Drinks.vue'
import Sides from '../views/restaurants/ingredients/Sides.vue'
import Restaurant from '../views/restaurants/RestaurantWelcome.vue'
import Orders from '../views/restaurants/RestaurantOrders.vue'
import GuestOrders from '../views/guest/GuestOrders.vue'
import GuestOrderDetails from '../views/guest/GuestOrderDetails.vue'
import GuestLogin from '../views/guest/GuestLogin.vue'
import RestaurantOrderDetails from '../views/restaurants/RestaurantOrderDetails.vue'
import RestaurantEditOrder from '../views/restaurants/RestaurantEditOrder.vue'
import RestaurantEditOrderBurger from '../views/restaurants/RestaurantEditOrderBurger.vue'
import PathNotFound from '../views/PathNotFound.vue'

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
    component: Restaurant
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
    path: '/restaurant/ingredients/breads',
    name: 'Breads',
    component: Breads,
    beforeEnter: requireAuth
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
    component: Sides,
    beforeEnter: requireAuth
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
    redirect: {
      name: 'Burgers'
    },
    beforeEnter: requireAuth
  },
  {
    path: '/restaurant/orders/:id/edit',
    name: 'RestaurantEditOrder',
    component: RestaurantEditOrder,
    beforeEnter: requireAuth
  },
  {
    path: '/restaurant/orders/:id/edit/burger/:index',
    name: 'RestaurantEditOrderBurger',
    component: RestaurantEditOrderBurger,
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
}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes, 
})

export default router