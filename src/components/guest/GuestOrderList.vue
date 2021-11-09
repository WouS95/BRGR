<template>
    <div v-for="order in orders" :key="order.orderNr">
        <GuestOrderSummary :order="order"/>
    </div>
</template>

<script>
import GuestOrderSummary from '../../components/guest/GuestOrderSummary.vue'
import useOrders from '../../composables/useOrders'

export default {
    components: {
        GuestOrderSummary
    },
    setup(){
        const {orders, error, load} = useOrders()
            load()

            return{orders, load}
    }
}
</script>

<style>

</style>