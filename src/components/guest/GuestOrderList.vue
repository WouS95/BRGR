<template>
    <div v-for="order in orders" :key="order.orderNr">
        <GuestOrderSummary :order="order"/>
    </div>
</template>

<script>
import GuestOrderSummary from '../../components/guest/GuestOrderSummary.vue'
import getOrders from '../../composables/getOrders'
import OrderStatus from '../../components/OrderStatus.vue'

export default {
    components: {
        GuestOrderSummary
    },
    setup(){
        const {orders, error} = getOrders()

        return{orders, error}
    }
}
</script>

<style>

</style>