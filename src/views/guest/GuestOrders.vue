<template>
  <h1>Your orders</h1>
  <!-- Component that renders the orders -->
  <GuestOrderList/>
</template>

<script>
import GuestOrderList from '../../components/guest/GuestOrderList.vue'

export default {
    components: {
        GuestOrderList
    },
}

</script>

<style>

</style>