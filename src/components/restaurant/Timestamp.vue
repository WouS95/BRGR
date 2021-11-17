<template>
    <p class="subtitle timestamp">
        {{ minutesAgo}} 
        <br>
        at {{ time }}
    </p>
</template>

<script>
import {computed} from 'vue'
import moment from 'moment'
export default {
    props: ['order'],
    setup(props){
        const time = computed(() => {
             return moment(props.order.orderTime.toDate()).format('h:mm a')
        })

        const minutesAgo = computed(() => {
             return moment(props.order.orderTime.toDate()).startOf('minute').fromNow()
        })

        return{ time, minutesAgo} 
    }
}
</script>

<style scoped>
    .subtitle.timestamp {
        font-style: italic;
        display: block;
        margin: 20px 0px;
    }
</style>