import { createRouter, createWebHistory } from 'vue-router'
import Burgers from '../views/restaurants/ingredients/Burgers.vue'
import Breads from '../views/restaurants/ingredients/Breads.vue'
import Toppings from '../views/restaurants/ingredients/Toppings.vue'
import Sauces from '../views/restaurants/ingredients/Sauces.vue'
import Drinks from '../views/restaurants/ingredients/Drinks.vue'
import Sides from '../views/restaurants/ingredients/Sides.vue'
const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/burgers',
    name: 'Burgers',
    component: Burgers
  },
  {
    path: '/breads',
    name: 'Breads',
    component: Breads
  },
  {
    path: '/toppings',
    name: 'Toppings',
    component: Toppings
  },
  {
    path: '/sauces',
    name: 'Sauces',
    component: Sauces
  },
  {
    path: '/sides',
    name: 'Sides',
    component: Sides
  },
  {
    path: '/drinks',
    name: 'Drinks',
    component: Drinks
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
