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
            <h3 class="price">
                € 
                {{ totalPrice }}
                </h3>
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
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;
        width: 90%;
        max-width: 350px;
        border-radius: 10px;
        margin: 20px auto;
    }

    .orderSummary h2 {
        font-size: 2.2em;
        letter-spacing: -0.1em;
        line-height: 1em;
        font-weight: 600;
        margin-bottom: 20px;
    }

    .orderSummary .subtitle {
        margin: 0px;
        font-size: 0.9em;
        color: #757575;
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

    .orderSummary .status {
        float: right;
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