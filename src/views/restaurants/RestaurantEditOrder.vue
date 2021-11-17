<template>
    <RestaurantHeader/>
    <div class="restaurantOrderDetailsWrapper" v-if="order">
        <div class="restaurantOrderDetails editOrder">
            <div class="buttons">
                <router-link :to="{name: 'RestaurantOrderDetails'}">
                    <button><span class="material-icons leftButton">arrow_back</span>Back</button>
                </router-link>
                <h1>Edit order 
                        <span v-if="order.orderNr < 10">0</span>
                        <span v-if="order.orderNr < 100">0</span>
                        <span>{{ order.orderNr}}</span>
                </h1>
            </div>
            <div class="orderItems">
                <div v-for="(item, index) in order.order" :key="index">
                    <div class="orderItemContainer">
                        <div class="burger" v-if="item.type === 'burger'">
                            <p class="subtitle price">€ {{ parseFloat(item.price).toFixed(2).replace(/\./g, ",") }}</p>
                            <!-- The program assumes the first ingredient in the burger is always the burger patty -->
                            <h3>{{ item.ingredients[0].name }} burger</h3>
                            <!-- The program assumes the second ingredient in the burger is always the bread -->
                            <p>{{ item.ingredients[1].name }} bread</p>
                            <p v-for="ingredient in item.ingredients.splice(2)" :key="ingredient.name">
                                {{ingredient.name}}
                            </p>
                        </div>
                        
                        <div v-else>
                            <p class="subtitle price">€ {{ parseFloat(item.price).toFixed(2).replace(/\./g, ",") }}</p>
                            <h3>{{item.name}}</h3>
                        </div>
                        <router-link :to="{name: 'RestaurantEditOrderBurger', params: {index: index}}">
                            <button v-if="item.type == 'burger'" @click="handleEdit"><span class="material-icons">edit</span> Edit</button>
                        </router-link>


                        <button @click="handleDelete(index)"><span class="material-icons">delete</span> Delete</button>
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
import { projectFirestore } from '../../firebase/config'

export default {
    components: {RestaurantHeader,RestaurantOrderItem, OrderStatus, TotalPrice, Timestamp, RestaurantStatusPopup},
    setup(){
        const route = useRoute()
        const { order, error } = getOrder(route.params.id)

        const handleDelete = async (index) => {
            let newOrderArray = []
            
            for (let i = 0; i < order.value.order.length; i++) {
                if( i != index ){
                    console.log(order.value.order[i])
                    newOrderArray.push(order.value.order[i])
                }
            }
            
            await projectFirestore.collection('orders').doc(route.params.id).update({order: newOrderArray}) 

        }

        return{ order, error, route, handleDelete }
    }

}
</script>

<style>

    .restaurantOrderDetails.editOrder button {
        vertical-align: top;
    }

    .restaurantOrderDetails.editOrder h1 {
        font-size: 2em;
        display: inline-block;
        color: #fff;
    }

    .restaurantOrderDetails.editOrder {
        background: none;
    }

    .restaurantOrderDetails.editOrder .orderItems {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        margin-top: 20px;
    }

    .restaurantOrderDetails.editOrder .orderItemContainer {
        padding: 25px 30px;
        background: #FFF;
        margin: 0px 20px 20px 0px;
        width: 400px;    
        border-radius: 10px;
    }

    .restaurantOrderDetails.editOrder h3 {
        margin: 0px;
        margin-bottom: 10px;
    }

    .restaurantOrderDetails.editOrder .price {
        float: right;
    }

    .restaurantOrderDetails.editOrder .orderItemContainer p {
        margin: 0px;
    }

    .restaurantOrderDetails.editOrder .orderItemContainer button {
        margin-top: 15px;
    }

</style>