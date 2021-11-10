<template>
  <h1>New Order</h1>
  <h3>Total: €{{ parseFloat(totalPrice).toFixed(2).replace(/\./g, ",") }}</h3>
  <form @submit.prevent>
    <!-- <li v-for="ingredient in ingredients" :key="ingredient.id">
      {{ ingredient }}
    </li> -->
    <div v-if="ingredients">
      <li
        v-for="ingredient in ingredients[0].burgerIngredients"
        v-bind:key="ingredient.id"
      >
        <span v-if="ingredient.type == 'burgerPatty'">
          {{ ingredient.name }}
        </span>
      </li>
    </div>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { projectFirestore } from "../../firebase/config";
// import getIngredients from "../../composables/getIngredients";

export default {
  components: {},
  setup() {
    // const { ingredients, error } = getIngredients();
    // console.log(ingredients.value);
    const ingredients = ref(null);
    const error = ref(null);
    let load = async () => {
      try {
        const res = await projectFirestore.collection("ingredients").get();
        console.log(res.docs);
        ingredients.value = res.docs.map((doc) => {
          console.log({ ...doc.data(), id: doc.id });
          return { ...doc.data(), id: doc.id };
        });
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
    };

    const tableNumber = ref(12);
    const totalPrice = ref(0.0);
    // totalPrice.value = 3.0;
    load();
    return { totalPrice, tableNumber, error, ingredients, load };
  },
};
</script>

<style>
</style>