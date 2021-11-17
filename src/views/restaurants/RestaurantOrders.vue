<template>
    <RestaurantHeader/>
    <RestaurantOrderList/>
</template>

<script>
import RestaurantHeader from '../../components/restaurant/RestaurantHeader.vue'
import RestaurantOrderList from '../../components/restaurant/RestaurantOrderList.vue'
export default {
    components: {RestaurantHeader, RestaurantOrderList}

};
</script>

<style>

</style>