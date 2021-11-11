<template>
    <div class="orderSummary">
        <div class="status" :class="statusClassName">
            <div class="statusSphere"/>
            <p class="statusText">{{ order.orderStatus }}</p>
        </div>
        <p class="subtitle">Order nr:</p>
        <h2 class="orderNumber">
            <span v-if="order.orderNr < 10">
                0
            </span>
            <span v-if="order.orderNr < 100">
                0
            </span>
            {{ order.orderNr }}
            </h2>
        <div class="orderList">
            <div v-for="item in order.order.slice(0,3)" :key="item.id">
                <div v-if="item.type === 'burger'">
                    <!-- The program assumes the first ingredient in the burger is always the burger patty -->
                    <p>{{ item.ingredients[0].name }} {{ item.type }}</p>
                </div>
                <div v-else>
                    <p>{{item.name}}</p>
                </div>
            </div>
            <div v-if="order.order.length > 3">...</div> 
            <div class="bottomItems">
                <h3 class="price">
                    € 
                    {{ parseFloat(totalPrice).toFixed(2).replace(/\./g, ",") }}
                    </h3>
                <router-link :to="{name: 'GuestOrderDetails', params: {id: order.id,}}">
                    <button>
                        <p>Details</p> 
                        <span class="material-icons">arrow_forward</span>
                    </button>
                </router-link>
            </div>
        </div>

    </div>
</template>

<script>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import OrderStatus from '../OrderStatus.vue'

export default {
    props: ["order"],
    compontents: {OrderStatus},
    setup(props){
        
        const router = useRouter()

        // calculates the total price so it can be displayed
        const totalPrice = computed(() => {
            let price = 0
            props.order.order.forEach(element => {
                price += element.price
            })

            return price
        })

        // gives specific class name to status elements so the correct color will be displayed
        const statusClassName = computed(() => {
            if(props.order.orderStatus === "preparing"){
                return "orange"
            } 
            if(props.order.orderStatus === "done" || props.order.orderStatus === "ready"){
                return "green"
            }
        })

        return {totalPrice, statusClassName}
    }
}
</script>

<style>

    .orderSummary {
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;
        width: 90%;
        max-width: 350px;
        border-radius: 10px;
        margin: 20px auto;
        text-align: left;
    }

    .orderSummary h2 {
        font-size: 2.2em;
        letter-spacing: -0.1em;
        line-height: 1em;
        font-weight: 600;
        margin-bottom: 20px;
    }

    .orderSummary button {
        font-size: 100%;
    }

    .orderSummary .price {
        display: inline-block;
        font-weight: 600;
        font-size: 1.5em;
        margin: 0px;
    }

    .orderNumber {
        margin: 0px;
    }

    .orderList p {
        margin: 0px;
    }

    .orderSummary .bottomItems {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-top: 30px;
    }



</style>