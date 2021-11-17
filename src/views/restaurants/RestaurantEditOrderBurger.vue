<template>
    <router-link :to="{name: 'RestaurantEditOrder'}">
        <button><span class="material-icons leftButton">arrow_back</span>Back</button>
    </router-link>
  <h1>Editing burger</h1>
    
    <div v-for=" (ingredient, index) in order.order[route.params.index].ingredients" :key="index">
      {{ingredient}}
    </div>
    

</template>

<script>
import {useRoute} from 'vue-router'
import getOrder from '../../composables/getOrder'

export default {
    setup(){
        const route = useRoute()

        const { order, error } = getOrder(route.params.id)

        // const burger = order.order[route.params.index]

        return {route, order, error}
    }

}
</script>

<style>

</style>