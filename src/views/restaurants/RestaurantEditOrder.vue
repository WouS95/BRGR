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
            <!-- Adding a new burger -->
            <div class="addingButtons" v-if="!isAddingSide && !isAddingDrink">
                <button v-if="isCreatingBurger" @click="isCreatingBurger = false"> 
                    <span class="material-icons">cancel</span>
                    Cancel Burger
                </button>
                <button v-else @click="isCreatingBurger = true">
                    <span class="material-icons">lunch_dining</span>
                    Add Burger 
                </button>
            </div>
            <form @submit.prevent="handleBurgerSubmit" class="container" v-if="isCreatingBurger">
                <h3>Creating burger</h3>
                <label for="burgerPatty">Select a patty:</label>
                <br>
                <select name="burgerPatty" v-model="creatingBurger.patty">
                    <option v-for="burgerPatty in restaurantIngredients[0].burgerPatty" :key="burgerPatty.name" :value="burgerPatty"> {{ burgerPatty.name }} </option>
                </select>
                <br>
                <br>
                <label for="burgerBread">Select a bun:</label>
                <br>
                <select name="burgerBread" v-model="creatingBurger.bread">
                    <option v-for="bread in restaurantIngredients[0].breads" :key="bread.name" :value="bread"> {{ bread.name }} </option>
                </select>
                <br>
                <p class="selectTitle">Select toppings:</p>
                <div v-for="topping in restaurantIngredients[0].toppings" :key="topping.name">
                <input type="checkbox"  v-model="creatingBurger.toppings" :value="topping">
                <label for="topping.name">{{ topping.name }} </label>
                </div>

                <p class="selectTitle">Select sauces:</p>
                <div v-for="sauce in restaurantIngredients[0].sauces" :key="sauce.name">
                <input type="checkbox"  v-model="creatingBurger.sauces" :value="sauce">
                <label for="sauce.name">{{ sauce.name }} </label>
                </div>
                <p class="totalPrice">Total: €{{ parseFloat(totalBurgerPrice).toFixed(2).replace(/\./g, ",") }}</p>
                <button :disabled="invalidBurgerForm" >Add burger</button>
            </form>
            
        <!-- Adding a new side -->
        <div class="addingButtons" v-if="!isCreatingBurger && !isAddingDrink">
            <button v-if="isAddingSide" @click="isAddingSide = false">
                <span class="material-icons">cancel</span>
                 Cancel side
                </button>
            <button v-else @click="isAddingSide = true">
                <span class="material-icons">takeout_dining</span>
                Add side
            </button>
        </div>
            <form @submit.prevent="handleSideSubmit" class="container" v-if="isAddingSide">
                <h3>Adding side</h3>
                <div v-for="side in restaurantIngredients[2].sides" :key="side.name">
                    <input type="radio"  v-model="newSide" :value="side">
                    <label> {{ side.name }} </label>
                </div>
                <button>Add side</button>
            </form>

            <!-- Adding a new drink -->
            <div class="addingButtons" v-if="!isCreatingBurger && !isAddingSide">
                <button v-if="isAddingDrink" @click="isAddingDrink = false">
                    <span class="material-icons">cancel</span>
                    Cancel drink
                </button>
                <button v-else @click="isAddingDrink = true">
                    <span class="material-icons">local_drink</span>
                    Add drink
                </button>
            </div>
            <form @submit.prevent="handleDrinkSubmit" class="container" v-if="isAddingDrink">
                <h3>Adding drink</h3>
                <div v-for="drink in restaurantIngredients[1].drinks" :key="drink.name">
                    <input type="radio"  v-model="newDrink" :value="drink">
                    <label> {{ drink.name }} </label>
                </div>
                <button>Add drink</button>
            </form>
            <div class="orderItems">
                <div v-for="(item, index) in order.order" :key="index">
                    <div class="orderItemContainer">
                        <div class="burger" v-if="item.type === 'burger'">
                            <p class="subtitle price">€ {{ parseFloat(item.price).toFixed(2).replace(/\./g, ",") }}</p>
                            <!-- The program assumes the first ingredient in the burger is always the burger patty -->
                            <h3>{{ item.ingredients[0].name }} burger</h3>
                            <!-- The program assumes the second ingredient in the burger is always the bread -->
                            <p>{{ item.ingredients[1].name }} bread</p>
                            <div v-for="ingredient in item.ingredients" :key="ingredient.name">
                                <p v-if="ingredient.type != 'bread' && ingredient.type != 'burgerPatty'"> {{ingredient.name}} </p>
                            </div>
                        </div>
                        
                        <div v-else>
                            <p class="subtitle price">€ {{ parseFloat(item.price).toFixed(2).replace(/\./g, ",") }}</p>
                            <h3>{{item.name}}</h3>
                        </div>
                        <button @click="handleDelete(index)"><span class="material-icons">delete</span> Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import getOrder from '../../composables/getOrder'
import RestaurantHeader from '../../components/restaurant/RestaurantHeader.vue'
import RestaurantOrderItem from '../../components/restaurant/RestaurantOrderItem.vue'
import OrderStatus from '../../components/OrderStatus.vue'
import TotalPrice from '../../components/TotalPrice.vue'
import Timestamp from '../../components/restaurant/Timestamp.vue'
import RestaurantStatusPopup from '../../components/restaurant/RestaurantStatusPopup.vue'
import { projectFirestore } from '../../firebase/config'
import getIngredients from '../../composables/getIngredients'

export default {
    components: {RestaurantHeader,RestaurantOrderItem, OrderStatus, TotalPrice, Timestamp, RestaurantStatusPopup},
    setup(){

        const isCreatingBurger = ref(false)
        const isAddingDrink = ref(false)
        const isAddingSide = ref(false)

        const newDrink = ref(null)
        const newSide = ref(null)
        
        const creatingBurger = ref({
        patty: null,
        bread: null,
        toppings: [],
        sauces: [],
        type: 'burger'
        })

        const invalidBurgerForm = computed(() => {
        return (
            creatingBurger.value.patty == null ||
            creatingBurger.value.bread == null
        )
        })
        const closeNewOrder = () => {
        context.emit("closeNewOrder");
        };

        const route = useRoute()
        const { order, error } = getOrder(route.params.id)

        const {restaurantIngredients, load} = getIngredients()
        load()

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

        const totalBurgerPrice = computed(() => {
            var price = 0;
            if (creatingBurger.value.sauces[0]) {
                creatingBurger.value.sauces.forEach((element) => {
                price += Number(element.price);
                });
            }
            if (creatingBurger.value.toppings[0]) {
                creatingBurger.value.toppings.forEach((element) => {
                price += Number(element.price);
                });
            }
            if (creatingBurger.value.bread) {
                price += Number(creatingBurger.value.bread.price);
            }
            if (creatingBurger.value.patty) {
                price += Number(creatingBurger.value.patty.price);
            }
            return price;
        });

         const handleBurgerSubmit = async () => {
            creatingBurger.value.price = totalBurgerPrice.value
            let newBurger = {
                type: 'burger',
                price: totalBurgerPrice.value,
                ingredients: []
            }
            creatingBurger.value.patty.type = 'burgerPatty'
            newBurger.ingredients.push(creatingBurger.value.patty)

            creatingBurger.value.bread.type = 'bread'
            newBurger.ingredients.push(creatingBurger.value.bread)
            
            for(let i = 0; i < creatingBurger.value.toppings.length; i++){
                creatingBurger.value.toppings[i].type = 'topping'
                newBurger.ingredients.push(creatingBurger.value.toppings[i])
                console.log(creatingBurger.value.toppings[i])
            }

            for(let i = 0; i < creatingBurger.value.sauces.length; i++){
                creatingBurger.value.toppings[i].type = 'sauce'
                newBurger.ingredients.push(creatingBurger.value.sauces[i])
            }
            console.log(newBurger)

            // pushes the burger into the order array
            order.value.order.push(newBurger)
            console.log(order.value.order)
            

            const res = await projectFirestore.collection("orders").doc(route.params.id).update({order: order.value.order})

            // empties the burger form
            creatingBurger.value = {
                patty: null,
                bread: null,
                toppings: [],
                sauces: [],
                type: 'burger'
            }
            // closes the burger creation window
            isCreatingBurger.value = false
        }

        const handleDrinkSubmit = async () => {
            newDrink.value.type = 'drink'
            order.value.order.push(newDrink.value)

            const res = await projectFirestore.collection("orders").doc(route.params.id).update({order: order.value.order})

            isAddingDrink.value = false
            newDrink.value = null
        }

        const handleSideSubmit = async () => {
            newSide.value.type = 'side'
            order.value.order.push(newSide.value)

            const res = await projectFirestore.collection("orders").doc(route.params.id).update({order: order.value.order})

            isAddingSide.value = false
            newSide.value = null
        }


        return{ 
            order, 
            error, 
            route, 
            handleDelete, 
            restaurantIngredients,
            isCreatingBurger,
            isAddingDrink,
            isAddingSide,
            newDrink,
            newSide,
            creatingBurger,
            invalidBurgerForm,
            totalBurgerPrice,
            handleBurgerSubmit,
            handleSideSubmit,
            handleDrinkSubmit
            }
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
        margin-bottom: 10px;
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
        margin-bottom: 20px;
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

    .restaurantOrderDetails.editOrder .container {
        padding: 20px 25px;
        border-radius: 10px;
        width: 400px;
        margin-top: 20px;
        margin-bottom: 40px;
    }

    .restaurantOrderDetails.editOrder .addingButtons {
        display: inline-block;
    }

    .restaurantOrderDetails.editOrder form button{
        margin: 0px;
        margin-top: 10px;
    }

    .restaurantOrderDetails.editOrder form .totalPrice {
        font-weight: 600;
    }

    .restaurantOrderDetails.editOrder input {
        width: 20px;
        height: 20px;
        vertical-align: top;
        margin-right: 10px;
        margin-bottom: 10px;
    }

</style>