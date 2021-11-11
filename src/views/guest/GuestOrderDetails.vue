<template>
<div class="orderDetails" v-if="order">
    <router-link :to="{name: 'GuestOrders'}">
        <button>
            <span class="material-icons">arrow_back</span>
            <p>Back</p> 
        </button>
    </router-link>
    <div class="container">
        <!-- The total price will be displayed inside the component -->
        <h3 class="totalPrice"><TotalPrice :order="order"/></h3>
        <p class="subtitle">Order number:</p>
        <h1>
            <span v-if="order.orderNr < 10">0</span>
            <span v-if="order.orderNr < 100">0</span>
            <span>{{ order.orderNr }}</span>
        </h1>
        <OrderStatus :order="order"/>
    </div>
    <div v-for="item in order.order" :key="item.id">
        <div class="container">
             <div class="burger" v-if="item.type === 'burger'">
                 <p class="subtitle price">€ {{ parseFloat(item.price).toFixed(2).replace(/\./g, ",") }}</p>
                <!-- The program assumes the first ingredient in the burger is always the burger patty -->
                <h3>{{ item.ingredients[0].name }} {{ item.type }}</h3>
                <p v-for="ingredient in item.ingredients" :key="ingredient.name">
                    {{ingredient.name}}
                    <span v-if="ingredient.type === 'bread'">bread</span>
                </p>
            </div>
            
            <div v-else>
                <p class="subtitle price">€ {{ parseFloat(item.price).toFixed(2).replace(/\./g, ",") }}</p>
                <h3>{{item.name}}</h3>
            </div>
        </div>
    </div>
</div>

</template>

<script>
import getOrder from '../../composables/getOrder'
import {useRoute} from 'vue-router'
import TotalPrice from '../../components/TotalPrice.vue'
import OrderStatus from '../../components/OrderStatus.vue'

export default {
    
    props: ['id'],
    components: {TotalPrice, OrderStatus},
    setup(props){
        const route = useRoute()
        
        const { order, error } = getOrder(route.params.id)
        

        return{ order, error}
    }

}
</script>

<style>

    .orderDetails {
        width: 90%;
        max-width: 350px;
        margin: 20px auto;
        text-align: left;
    }

    .orderDetails h1 {
        margin: 0px;
        font-size: 2.5em;
        font-weight: 600;
    }

    .orderDetails .container {
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 10px;
        margin: 15px auto;
    }

    .orderDetails button {
        font-size: 100%;
    }

    .orderDetails p {
        margin: 2px;
        font-size: 0.9em;
    }

    .orderDetails h3 {
        font-weight: 600;
        font-size: 1.3em;
        margin: 0px;
    }

    .orderDetails .price {
        float: right;
        margin-top: 5px;
    }

    .orderDetails .totalPrice {
        float: right;
    }

    .orderDetails .status {
        display: inline-block;
    }



</style>