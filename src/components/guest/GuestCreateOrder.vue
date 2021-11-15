<template>
  <h1>New Order</h1>
  <h3>Total: €{{ parseFloat(totalPrice).toFixed(2).replace(/\./g, ",") }}</h3>

  <div v-if="burgerIngredients">
    <form>
      <h2>Select your bread</h2>
      <div
        v-for="(breads, index) in burgerIngredients.breads"
        :key="breads.name"
      >
        <label v-if="breads.isAvailable" :for="'bread' + index">{{
          breads.name
        }}</label>
        <input
          v-if="breads.isAvailable"
          v-model="selectedIngredients.bread"
          :value="breads"
          type="radio"
          name="bread"
          :id="'bread' + index"
        />
      </div>
      <h2>Select your patty</h2>
      <div
        v-for="(pattys, index) in burgerIngredients.burgerPatty"
        :key="pattys.name"
      >
        <label v-if="pattys.isAvailable" :for="'patty' + index">{{
          pattys.name
        }}</label>
        <input
          v-if="pattys.isAvailable"
          v-model="selectedIngredients.patty"
          :value="pattys"
          type="radio"
          name="patty"
          :id="'patty' + index"
        />
      </div>
    </form>
    <p>bread: {{ selectedIngredients.bread.name }}</p>
    <p>patty: {{ selectedIngredients.patty.name }}</p>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { projectFirestore } from "../../firebase/config";

export default {
  setup() {
    const tableNumber = ref(12);
    const ingredients = ref(null);
    // const totalPrice = ref(null);
    const error = ref(null);
    const selectedIngredients = ref({
      bread: null,
      patty: null,
      sauces: [],
      toppings: [],
    });

    const totalPrice = computed(() => {
      var price = 0;
      if (selectedIngredients.value.sauces[0]) {
        selectedIngredients.value.sauces.forEach((element) => {
          price += Number(element.price);
        });
      }
      if (selectedIngredients.value.toppings[0]) {
        selectedIngredients.value.toppings.forEach((element) => {
          price += Number(element.price);
        });
      }
      if (selectedIngredients.value.bread) {
        price += Number(selectedIngredients.value.bread.price);
      }
      if (selectedIngredients.value.patty) {
        price += Number(selectedIngredients.value.patty.price);
      }
      return price;
    });

    let load = async () => {
      try {
        const res = await projectFirestore.collection("ingredients").get();
        // console.log(res.docs);
        ingredients.value = res.docs.map((doc) => {
          //console.log(doc.data(), doc.id);
          return { ...doc.data(), id: doc.id };
        });
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
    };

    const burgerIngredients = computed(() => {
      if (ingredients.value) {
        const res = ingredients.value.filter((doc) => {
          return doc.id == "burgerIngredients";
        });
        return res[0];
      }
    });

    load();
    return {
      totalPrice,
      tableNumber,
      error,
      selectedIngredients,
      burgerIngredients,
      load,
      ingredients,
    };
  },
};
</script>

<style>
</style>