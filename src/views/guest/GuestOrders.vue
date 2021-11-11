<template>
  <h1>Your orders</h1>
  <!-- Component that renders the orders -->
  <GuestOrderList :tableNr="tableNr"/>
</template>

<script>
import GuestOrderList from '../../components/guest/GuestOrderList.vue'
import { useRoute } from 'vue-router'

export default {
  components: {
        GuestOrderList
  },
  setup(){
    const route = useRoute()
    const tableNr = route.params.tableNr

    return{tableNr}
  }
}

</script>

<style>

</style>