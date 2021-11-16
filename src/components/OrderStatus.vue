<template>
  <div class="status" :class="statusClassName">
            <div class="statusSphere"/>
            <span class="statusText">{{ order.orderStatus }}</span>
    </div>
</template>

<script>
import {computed} from 'vue'

export default {
    props: ['order'],
    setup(props){
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
        return {statusClassName}
    }

}
</script>

<style>
.statusSphere {
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

    .statusText {
        display: inline-block;
    }

    .status.orange .statusText {
        color: orange;
    }

    .status.orange .statusSphere {
        background: #F57C00
    }

    .status.green .statusText {
        color: green;
    }

    .status.green .statusSphere {
        background: green;
    }

    .status.red .statusSphere {
        background: #D32F2F
    }

    .status.red .statusText {
        color: #D32F2F
    }



</style>