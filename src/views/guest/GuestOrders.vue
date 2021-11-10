<template>
  <div v-if="!newOrder">
    <h1>Your orders</h1>
    <button @click="newOrder = true">New order</button>
    <GuestOrderList />
  </div>
  <div v-else>
    <h1>New order</h1>
    <button @click="newOrder = false">Cancel</button>
    <NewOrder />
  </div>
  <FooterStatusBar :tableNumber="currentTableNumber" />
</template>

<script>
import { ref } from "@vue/reactivity";
import GuestOrderList from "../../components/guest/GuestOrderList.vue";
import NewOrder from "../../components/guest/GuestCreateOrder.vue";
import FooterStatusBar from "../../components/guest/GuestStatusBarFooter.vue";
export default {
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