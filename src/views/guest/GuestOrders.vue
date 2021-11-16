<template>
  <div v-if="!newOrder">
    <h1>Your orders</h1>
    <button @click="newOrder = true">New order</button>
    <GuestOrderList :tableNr="tableNr" />
  </div>
  <div v-else>
    <NewOrder :tableNr="tableNr" @closeNewOrder="newOrder = false" />
  </div>
  <FooterStatusBar :tableNr="tableNr" />
</template>

<script>
import { ref } from "@vue/reactivity";
import GuestOrderList from "../../components/guest/GuestOrderList.vue";
import NewOrder from "../../components/guest/GuestCreateOrder.vue";
import FooterStatusBar from "../../components/guest/GuestStatusBarFooter.vue";
import { useRoute } from "vue-router";
export default {
  components: {
    GuestOrderList,
    NewOrder,
    FooterStatusBar,
  },
  setup() {
    const route = useRoute();
    const tableNr = route.params.tableNr;
    const newOrder = ref(false);
    return { newOrder, tableNr };
  },
};
</script>

<style>
</style>