<template>
  <div v-if="!newOrder">
    <h1>Your orders</h1>
    <button @click="newOrder = true">New order</button>
    <GuestOrderList />
  </div>
  <div v-else>
    <NewOrder @closeNewOrder="newOrder = false" />
  </div>
  <FooterStatusBar :tableNumber="currentTableNumber" />
</template>

<script>
import { ref } from "@vue/reactivity";
import GuestOrderList from "../../components/guest/GuestOrderList.vue";
import NewOrder from "../../components/guest/GuestCreateOrder.vue";
import FooterStatusBar from "../../components/guest/GuestStatusBarFooter.vue";
export default {
  // emits: ["closeNewOrder"],
  components: {
    GuestOrderList,
    NewOrder,
    FooterStatusBar,
  },
  setup() {
    const currentTableNumber = ref(12);
    const newOrder = ref(false);
    return { newOrder, currentTableNumber };
  },
};
</script>

<style>
</style>