<template>
  <h1>New Order</h1>
  <h3>Total: €{{ parseFloat(totalPrice).toFixed(2).replace(/\./g, ",") }}</h3>
  <form @submit.prevent>
    <div class="burgeringredients" v-if="burgerIngredients">
      <ul v-if="!selectedIngredients.breads">
        <h2>breads</h2>
        <li
          @click="addBreadToOrder(breads)"
          v-for="breads in burgerIngredients.breads"
          :key="breads.name"
        >
          {{ breads.name }}
        </li>
      </ul>
      <ul>
        <h2>Patty's</h2>
        <li
          @click="addPattyToOrder(burgerPattys)"
          v-for="burgerPattys in burgerIngredients.burgerPatty"
          :key="burgerPattys.name"
        >
          {{ burgerPattys.name }}
        </li>
      </ul>
      <ul>
        <h2>Sauces</h2>
        <li
          @click="addSauceToOrder(sauces)"
          v-for="sauces in burgerIngredients.sauces"
          :key="sauces.name"
        >
          {{ sauces.name }}
        </li>
      </ul>
      <ul>
        <h2>Toppings</h2>
        <li
          @click="addToppingToOrder(toppings)"
          v-for="toppings in burgerIngredients.toppings"
          :key="toppings.name"
        >
          {{ toppings.name }}
        </li>
      </ul>
    </div>
  </form>
  <div
    v-if="
      selectedIngredients.bread ||
      selectedIngredients.patty ||
      selectedIngredients.sauces[0] ||
      selectedIngredients.toppings[0]
    "
  >
    <h1>Order</h1>
    <div
      v-for="ingredient in selectedIngredients.bread"
      :key="ingredient"
      @click="removeBread()"
    >
      {{ ingredient }}
    </div>
    <div
      v-for="ingredient in selectedIngredients.patty"
      :key="ingredient"
      @click="removePatty()"
    >
      {{ ingredient }}
    </div>
    <div
      v-for="ingredient in selectedIngredients.sauces"
      :key="ingredient"
      @click="removeSauce(ingredient)"
    >
      {{ ingredient }}
    </div>
    <div
      v-for="ingredient in selectedIngredients.toppings"
      :key="ingredient"
      @click="removeTopping(ingredient)"
    >
      {{ ingredient }}
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { projectFirestore } from "../../firebase/config";

export default {
  components: {},
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

    const addBreadToOrder = (item) => {
      selectedIngredients.value.bread = item;
    };
    const addPattyToOrder = (item) => {
      selectedIngredients.value.patty = item;
    };
    const addSauceToOrder = (item) => {
      if (!selectedIngredients.value.sauces.includes(item)) {
        selectedIngredients.value.sauces.push(item);
      }
    };
    const addToppingToOrder = (item) => {
      if (!selectedIngredients.value.toppings.includes(item)) {
        selectedIngredients.value.toppings.push(item);
      }
    };
    const removeBread = () => {
      selectedIngredients.value.bread = null;
    };
    const removePatty = () => {
      selectedIngredients.value.patty = null;
    };
    const removeSauce = (item) => {
      const index = selectedIngredients.value.sauces.indexOf(item);
      selectedIngredients.value.sauces.splice(index, 1);
    };
    const removeTopping = (item) => {
      const index = selectedIngredients.value.toppings.indexOf(item);
      selectedIngredients.value.toppings.splice(index, 1);
    };
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
      burgerIngredients,
      load,
      ingredients,
      addBreadToOrder,
      addPattyToOrder,
      addSauceToOrder,
      addToppingToOrder,
      selectedIngredients,
      removeBread,
      removePatty,
      removeSauce,
      removeTopping,
    };
  },
};
</script>

<style>
</style>