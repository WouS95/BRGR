<template>

<div class="restaurantOrderList">
    <h1>Orders</h1>
    <input v-model="showFinishedOrders" type="checkbox">
    <label>Also show finished orders</label>
        <div class="RestaurantOrderWrapper">
            <!-- Renders the orders that are not done first, so the they will be sorted -->
            <div v-for="order in orders" :key="order.orderNr">
            <RestaurantOrderSummary
                :order="order"
                v-if="order.orderStatus == 'preparing'"
            />
            </div>
            <div v-for="order in orders" :key="order.orderNr">
            <RestaurantOrderSummary
                :order="order"
                v-if="(order.orderStatus == 'done' || order.orderStatus == 'ready') && showFinishedOrders"
            />
            <RestaurantOrderSummary
                :order="order"
                v-if="(order.orderStatus == 'canceled') && showFinishedOrders"
            />
            </div>
        </div>
  </div>

</template>

<script>
import RestaurantOrderSummary from '../../components/restaurant/RestaurantOrderSummary.vue'
import getOrders from '../../composables/getOrders'
import {ref} from 'vue'

export default {
    components: {
        RestaurantOrderSummary,
    },
    setup(props){

        const showFinishedOrders = ref(false)
        const {orders, error} = getOrders()

        return{orders, error, showFinishedOrders}
    }
}
</script>

<style>
    .restaurantOrderList  {
        width: 100%;
        text-align: left;
        margin-left: 220px;
    }

    .restaurantOrderList  h1 {
        margin-left: 30px;
        color: #FFF;
        font-weight: 600;
        font-size: 2.5em;
        display: inline-block;
    }

    .restaurantOrderList label {
        margin-right: 30px;
        color: #FFF;
    }

    .restaurantOrderList input {
        height: 30px;
        width: 30px;
        margin-left: 30px;
    }

    .RestaurantOrderWrapper {
        display: flex;
        flex-wrap: wrap;
    }
</style>