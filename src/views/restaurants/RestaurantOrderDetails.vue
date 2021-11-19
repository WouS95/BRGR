<template>
    <RestaurantStatusPopup @closePopup="closePopup" v-if="isChangingStatus" :orderId="route.params.id"/>
    <RestaurantHeader/>
    <div class="restaurantOrderDetailsWrapper" v-if="order">
        <div class="restaurantOrderDetails">
            <div class="buttons">
                <router-link :to="{name: 'RestaurantOrders'}">
                    <button class="secondary" ><span class="material-icons leftButton">arrow_back</span>Back</button>
                </router-link>

                <router-link :to="{name: 'RestaurantEditOrder', params: {id: route.params.id}}">
                <button>Edit<span class="material-icons rightButton">edit</span></button>
                </router-link>
                <button @click="isChangingStatus = true" >Update status<span class="material-icons rightButton">send</span></button>
            </div>
            <div class="orderInfo">
                <div class="orderSpecs">
                    <p class="subtitle">Order number:</p>
                    <h1>
                        <span v-if="order.orderNr < 10">0</span>
                        <span v-if="order.orderNr < 100">0</span>
                        <span>{{ order.orderNr}}</span>
                    </h1>
                    <p>Status:</p>
                    <OrderStatus :order="order"/>
                    <h3 class="totalPrice"><TotalPrice :order="order"/></h3>
                    <Timestamp :order="order"/>
                </div>
                <div class="orderBurgers">
                    <h2><span class="material-icons">lunch_dining</span>Burgers</h2>
                    <div class="bottomBorder"/>
                    <div class="orderTypeItems">
                        <div v-for="item in order.order" :key="item.id">
                            <RestaurantOrderItem
                            :orderItem="item"
                            v-if="item.type == 'burger'"
                            />
                        </div>
                    </div>
                </div>
                <div class="orderSides">
                    <h2><span class="material-icons">takeout_dining</span>Sides</h2>
                    <div class="bottomBorder"/>
                    <div class="orderTypeItems">
                        <div v-for="item in order.order" :key="item.id">
                            <RestaurantOrderItem
                            :orderItem="item"
                            v-if="item.type == 'side'"
                            />
                        </div>
                    </div>
                </div>
                <div class="orderDrinks">
                    <h2><span class="material-icons">local_drink</span>Drinks</h2>
                    <div class="bottomBorder"/>
                    <div class="orderTypeItems">
                        <div v-for="item in order.order" :key="item.id">
                            <RestaurantOrderItem
                            :orderItem="item"
                            v-if="item.type == 'drink'"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue'
import {useRoute} from 'vue-router'
import getOrder from '../../composables/getOrder'
import RestaurantHeader from '../../components/restaurant/RestaurantHeader.vue'
import RestaurantOrderItem from '../../components/restaurant/RestaurantOrderItem.vue'
import OrderStatus from '../../components/OrderStatus.vue'
import TotalPrice from '../../components/TotalPrice.vue'
import Timestamp from '../../components/restaurant/Timestamp.vue'
import RestaurantStatusPopup from '../../components/restaurant/RestaurantStatusPopup.vue'

export default {
    components: {RestaurantHeader,RestaurantOrderItem, OrderStatus, TotalPrice, Timestamp, RestaurantStatusPopup},
    setup(){
        const route = useRoute()

        let isChangingStatus = ref(false)

        const closePopup = () => {
            isChangingStatus.value = false
        }
        
        const { order, error } = getOrder(route.params.id)

        return{ order, error, isChangingStatus, closePopup, route }
    }

}
</script>

<style>
    .restaurantOrderDetailsWrapper{
        height: 800px;
        width: 100%;
        min-width: 1200px;
        text-align: left;
        padding: 30px;
        padding-left: 250px;
    }

    .restaurantOrderDetails {
        background: #FFF;
        width: 100%;
        height: 100%;
        border-radius: 15px;
        padding: 50px;
    }

    .restaurantOrderDetails a {
        text-decoration: none;
    }

    .restaurantOrderDetails button {
        font-size: 100%;
        margin-right: 25px;
    }

    .restaurantOrderDetails .leftButton {
        margin-right: 5px;
    }

    .restaurantOrderDetails .rightButton {
        margin-left: 5px;
    }

    .restaurantOrderDetails .orderInfo {
        display: flex;
        margin-top: 30px;
        height: 570px;
    }


    .restaurantOrderDetails .orderInfo .orderSpecs{
        border-right: 1px solid #E0E0E0;
        width: 20%;
    }

    .restaurantOrderDetails .orderInfo .orderBurgers{
        border-right: 1px solid #E0E0E0;
        width: 30%;
    }

    .restaurantOrderDetails .orderInfo .orderDrinks{
        width: 25%;
    }

    .restaurantOrderDetails .orderInfo .orderSides{
        border-right: 1px solid #E0E0E0;
        width: 25%;
    }

    .restaurantOrderDetails h2{
        font-weight: 500;
        color: #757575;
        margin-left: 20px;

    }

    .restaurantOrderDetails h2 .material-icons{
        font-size: 1.5em;
        vertical-align: top;
        margin-right: 5px;
    }

    .restaurantOrderDetails .bottomBorder {
        height: 1px;
        width: 85%;
        margin: auto;
        background: #E0E0E0;
    }

    .restaurantOrderDetails .orderTypeItems {
        overflow-y: scroll;
        height: 525px;
        padding-left: 20px;
    }

    .restaurantOrderDetails h1 {
        font-weight: 600;
        font-size: 3em;
        margin: 0px;
        color: #000;
    }



</style>