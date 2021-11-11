<template>
    <!-- Renders every single order in a summary -->
    <div v-for="order in orders" :key="order.orderNr">
        <GuestOrderSummary 
        :order="order"
        v-if="order.tableNr == tableNr"
        />
    </div>
</template>

<script>
import GuestOrderSummary from '../../components/guest/GuestOrderSummary.vue'
import getOrders from '../../composables/getOrders'
import {useRouter} from 'vue-router'

export default {
    components: {
        GuestOrderSummary
    },
    props: ['tableNr'],
    setup(props){
        const {orders, error} = getOrders()
        const router = useRouter()

        // redirects to the login screen if there's no table number
        if(!props.tableNr){
            router.push({name: "GuestLogin"})
        }

        return{orders, error}
    }
}
</script>

<style>

</style>