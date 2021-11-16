<template>
    <div class="restaurantOrderSummary">
            <div class="status" :class="statusClassName">
                <div class="statusSphere"/>
                <p class="statusText">{{ order.orderStatus }}</p>
            </div>
            <h2 class="orderNumber">
                <span v-if="order.orderNr < 10">
                    0
                </span>
                <span v-if="order.orderNr < 100">
                    0
                </span>
                {{ order.orderNr }}
                </h2>
                <p class="subtitle">Table {{ order.tableNr }}</p>
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
                </div>
                <h3 class="price">
                    € 
                    {{ parseFloat(totalPrice).toFixed(2).replace(/\./g, ",") }}
                </h3>
                <p class="subtitle timestamp">{{ timeStamp }}</p>
                <div class="buttons">
                        <button v-if="order.orderStatus == 'preparing'" @click="setToDone">
                            <p>Set to done</p> 
                            <span class="material-icons">check_circle</span>
                        </button>
                        <router-link :to="{name: 'RestaurantOrderDetails', params: {id: order.id}}">
                            <button>
                            <p>Details</p> 
                            <span class="material-icons">arrow_forward</span>
                        </button>
                    </router-link>
                </div>
    </div>
</template>

<script>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import OrderStatus from '../OrderStatus.vue'
import {projectFirestore} from '../../firebase/config'
import moment from 'moment'

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
            if(props.order.orderStatus === "done" || props.order.orderStatus === "canceled"){
                return "red"
            }
        })

        const setToDone = async () => {
            await projectFirestore.collection('orders').doc(props.order.id).update({orderStatus: "done"}) 
        }

        const timeStamp = computed(() => {
            return moment(props.order.orderTime.toDate()).startOf('minute').fromNow() + " at " + moment(props.order.orderTime.toDate()).format('h:mm a')
        })


        return {totalPrice, statusClassName, setToDone, timeStamp}
    }

}
</script>

<style>

    .restaurantOrderSummary {
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;
        width: 400px;
        border-radius: 10px;
        margin: 20px;
        text-align: left;
    }

    .restaurantOrderSummary .router-link-active {
        color: #000;
        text-decoration: none;
    }

    .restaurantOrderSummary a{
        color: #000;
        text-decoration: none;
    }

    .restaurantOrderSummary h2 {
        font-size: 2.2em;
        letter-spacing: -0.12em;
        line-height: 1em;
        font-weight: 600;
        margin-bottom: 20px;
        display: inline-block;
    }

    .restaurantOrderSummary .subtitle {
        display: inline-block;
        margin-left: 15px;
    }

    .restaurantOrderSummary button {
        font-size: 100%;
    }

    .restaurantOrderSummary .price {
        display: inline-block;
        font-weight: 600;
        font-size: 1.5em;
        margin: 0px;
    }

    .restaurantOrderSummary .status {
        float: right;
    }

    .restaurantOrderSummary .statusText {
        margin: 0px;
    }

    .orderNumber {
        margin: 0px;
    }

    .orderList p {
        margin: 0px;
    }

    .restaurantOrderSummary.buttons {
        margin-top: 20px;
    }

    .restaurantOrderSummary .buttons button {
        display: block;
        margin-bottom: 10px;
    }

    .restaurantOrderSummary .subtitle.timestamp {
        font-style: italic;
        display: block;
        margin: 20px 0px;
    }



</style>