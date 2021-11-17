<template>
  € {{ parseFloat(totalPrice).toFixed(2).replace(/\./g, ",") }}
</template>

<script>
import { computed } from "vue";

export default {
  props: ["order"],
  setup(props) {
    const totalPrice = computed(() => {
      let price = 0;
      props.order.order.forEach((element) => {
        price += Number(element.price);
      });

      return price;
    });

    return { totalPrice };
  },
};
</script>

<style>
</style>