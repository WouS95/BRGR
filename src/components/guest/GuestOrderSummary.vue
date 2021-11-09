<template>
    <div class="orderSummary">
        <p class="subtitle">Order nr:</p>
        <h2 class="orderNumber">{{ order.orderNr }}</h2>
        <div class="status" :class="statusClassName">
            <div class="statusSphere"/>
            <p class="statusText">{{ order.orderStatus }}</p>
        </div>
        <div class="orderList">
            <div v-for="item in order.order.slice(0,3)" :key="item.id">
                <div v-if="item.type === 'burger'">
                    <p>{{ item.ingredients[0].name }} {{ item.type }}</p>
                </div>
                <div v-else>
                    <p>{{item.name}}</p>
                </div>
            </div>
            <div v-if="order.order.length > 3">...</div> 
            <h3 class="price">{{ totalPrice }}</h3>
            <button>
                Details 
                <span class="material-icons">arrow_forward</span>
            </button>
        </div>

    </div>
</template>

<script>
import {computed} from 'vue'

export default {
    props: ["order"],
    setup(props){

        const totalPrice = computed(() => {
            let price = 0
            props.order.order.forEach(element => {
                console.log(element)
                price += element.price
                console.log(price)
            })
            return price
        })

        const statusClassName = computed(() => {
            if(props.order.orderStatus === "preparing"){
                return "orange"
            } 
            if(props.order.orderStatus === "done" || props.order.orderStatus === "ready"){
                return "green"
            }
        })

        return {statusClassName, totalPrice}
    }
}
</script>

<style>

    .orderSummary {
        padding: 20px;
        background: #fff;
        width: 80%;
        max-width: 350px;
        border-radius: 10px;
        margin: 20px 0px;
    }
    .subtitle {
        margin: 0px;
    }

    .orderNumber {
        margin: 0px;
    }

    .orderSummary .statusSphere {
        width: 15px;
        height: 15px;
        background-color: grey;
        border-radius: 100%;
        display: inline-block;
        margin-right: 10px;
    }

    .orderSummary .statusText {
        display: inline-block;
    }

    .status.orange .statusText {
        color: orange;
    }

    .status.orange .statusSphere {
        background: orange;
    }

    .status.green .statusText {
        color: green;
    }

    .status.green .statusSphere {
        background: green;
    }

    .orderList p {
        margin: 0px;
    }

</style>