<template>
  <h1>New Order</h1>
  <button class="close" @click="closeNewOrder">Close</button>
  <h3>
    Total: €{{ parseFloat(totalBurgerPrice).toFixed(2).replace(/\./g, ",") }}
  </h3>
  <div v-if="burgerIngredients">
    <form @submit.prevent="handleSubmit">
      <button :disabled="invalidForm">Checkout</button>
      <div class="selectburger" v-show="showSelectBurger">
        <h2>Select your bread</h2>
        <div
          v-for="(breads, index) in burgerIngredients.breads"
          :key="breads.name"
        >
          <label v-if="breads.isAvailable" :for="'bread' + index">{{
            breads.name
          }}</label>
          <input
            required
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
            required
            v-if="pattys.isAvailable"
            v-model="selectedIngredients.patty"
            :value="pattys"
            type="radio"
            name="patty"
            :id="'patty' + index"
          />
        </div>

        <h2>Select your toppings</h2>
        <div
          v-for="(toppings, index) in burgerIngredients.toppings"
          :key="toppings.name"
        >
          <label v-if="toppings.isAvailable" :for="'topping' + index">{{
            toppings.name
          }}</label>
          <input
            v-if="toppings.isAvailable"
            v-model="selectedIngredients.toppings"
            type="checkbox"
            name="topping"
            :id="'topping' + index"
            :value="toppings"
          />
        </div>
        <h2>Select your sauces</h2>
        <div
          v-for="(sauces, index) in burgerIngredients.sauces"
          :key="sauces.name"
        >
          <label v-if="sauces.isAvailable" :for="'sauce' + index">{{
            sauces.name
          }}</label>
          <input
            v-if="sauces.isAvailable"
            v-model="selectedIngredients.sauces"
            type="checkbox"
            name="sauce"
            :id="'sauce' + index"
            :value="sauces"
          />
        </div>
        <div @click="showSelectBurger = false">x</div>
      </div>
      <div v-show="showSelectDrink" class="selectdrink">
        <h2 @click="selectedIngredients.drink = null">Select your drink</h2>
        <div
          v-for="(drinks, index) in drinkIngredients.drinks"
          :key="drinks.name"
        >
          <label v-if="drinks.isAvailable" :for="'drink' + index">{{
            drinks.name
          }}</label>
          <input
            v-if="drinks.isAvailable"
            v-model="selectedIngredients.drinks"
            type="checkbox"
            name="drink"
            :id="'drink' + index"
            :value="drinks"
          />
        </div>
      </div>
      <div v-show="showSelectSide" class="selectside">
        <h2 @click="selectedIngredients.side = null">Select your side</h2>
        <div v-for="(sides, index) in sideIngredients.sides" :key="sides.name">
          <label v-if="sides.isAvailable" :for="'side' + index">{{
            sides.name
          }}</label>
          <input
            v-if="sides.isAvailable"
            v-model="selectedIngredients.sides"
            type="checkbox"
            name="side"
            :id="'side' + index"
            :value="sides"
          />
        </div>
      </div>
    </form>
    <div id="burgerCard">
      <p v-if="selectedIngredients.bread">
        bread: {{ selectedIngredients.bread }}
        {{ selectedIngredients.bread.price }}
      </p>
      <p v-if="selectedIngredients.patty">
        Patty: {{ selectedIngredients.patty }}
        {{ selectedIngredients.patty.price }}
      </p>

      <p v-if="selectedIngredients.toppings">
        Toppings:
        <span
          v-for="topping in selectedIngredients.toppings"
          :key="topping.name"
        >
          {{ topping.name }},
        </span>
      </p>

      <p v-if="selectedIngredients.sauces">
        Sauces:
        <span v-for="sauce in selectedIngredients.sauces" :key="sauce.name">
          {{ sauce.name }},
        </span>
      </p>
    </div>
    <div id="drinkCard">
      <p v-if="selectedIngredients.drinks">
        drinks: {{ selectedIngredients.drinks }}
        {{ selectedIngredients.drinks.price }}
      </p>
    </div>
    <div id="sideCard">
      <p v-if="selectedIngredients.sides">
        sides: {{ selectedIngredients.sides }}
        {{ selectedIngredients.sides.price }}
      </p>
    </div>
    <input
      hidden
      id="addIngredientButton"
      type="checkbox"
      class="addbutton"
      v-model="addIngredientMenuOpen"
    />
    <label for="addIngredientButton" class="addingredientbutton">+</label>
    <div v-if="addIngredientMenuOpen">
      <p
        @click="
          showSelectBurger = true;
          addIngredientMenuOpen = false;
        "
      >
        burger
      </p>
      <p
        @click="
          showSelectDrink = true;
          addIngredientMenuOpen = false;
        "
      >
        drinks
      </p>
      <p>sides</p>
    </div>
  </div>
  <div v-else>loading</div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { projectFirestore, timestamp } from "../../firebase/config";

export default {
  props: ["tableNr"],
  emits: ["closeNewOrder"],
  setup(props, context) {
    const tableNumber = props.tableNr;
    const addIngredientMenuOpen = ref(false);
    const ingredients = ref(null);
    const showSelectBurger = ref(true);
    const showSelectDrink = ref(true);
    const showSelectSide = ref(true);
    // const burgerIngredients = ref(false);
    // const totalBurgerPrice = ref(null);
    const error = ref(null);
    const selectedIngredients = ref({
      bread: null,
      patty: null,
      drinks: [],
      sides: [],
      sauces: [],
      toppings: [],
    });
    const invalidForm = computed(() => {
      return (
        selectedIngredients.value.bread == null ||
        selectedIngredients.value.patty == null
      );
    });
    const closeNewOrder = () => {
      context.emit("closeNewOrder");
    };
    const handleSubmit = async () => {
      const orderData = {
        order: [
          {
            ingredients: [
              {
                type: "burgerPatty",
                name: selectedIngredients.value.patty.name,
              },
              {
                type: "bread",
                name: selectedIngredients.value.bread.name,
              },
            ],
            price: Number(totalBurgerPrice.value),
            type: "burger",
          },
        ],
        orderNr: (await getLastOrderId()) + 1,
        orderStatus: "preparing",
        orderTime: timestamp(),
        tableNr: Number(tableNumber),
      };

      for (let i = 0; i < selectedIngredients.value.sauces.length; i++) {
        orderData.order[0].ingredients.push({
          type: "sauce",
          name: selectedIngredients.value.sauces[i].name,
        });
      }
      for (let i = 0; i < selectedIngredients.value.toppings.length; i++) {
        orderData.order[0].ingredients.push({
          type: "topping",
          name: selectedIngredients.value.toppings[i].name,
        });
      }
      for (let i = 0; i < selectedIngredients.value.drinks.length; i++) {
        orderData.order.push({
          type: "drink",
          name: selectedIngredients.value.drinks[i].name,
          price: Number(selectedIngredients.value.drinks[i].price),
        });
      }
      for (let i = 0; i < selectedIngredients.value.sides.length; i++) {
        orderData.order.push({
          type: "side",
          name: selectedIngredients.value.sides[i].name,
          price: Number(selectedIngredients.value.sides[i].price),
        });
      }
      console.log(orderData);

      const res = await projectFirestore.collection("orders").add(orderData);
    };

    const totalBurgerPrice = computed(() => {
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
          // console.log(doc.data(), doc.id);
          return { ...doc.data(), id: doc.id };
        });
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
    };
    let getLastOrderId = async () => {
      let result;
      try {
        const res = await projectFirestore
          .collection("orders")
          .orderBy("orderNr", "desc")
          .limit(1)
          .get();
        result = res.docs.map((doc) => {
          console.log(doc.data().orderNr);
          return doc.data().orderNr;
        });
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
      return result[0];
    };

    const burgerIngredients = computed(() => {
      if (ingredients.value) {
        const res = ingredients.value.filter((doc) => {
          return doc.id == "burgerIngredients";
        });
        return res[0];
      }
    });
    const drinkIngredients = computed(() => {
      if (ingredients.value) {
        const res = ingredients.value.filter((doc) => {
          return doc.id == "drinks";
        });
        return res[0];
      }
    });
    const sideIngredients = computed(() => {
      if (ingredients.value) {
        const res = ingredients.value.filter((doc) => {
          return doc.id == "sides";
        });
        return res[0];
      }
    });

    load();
    return {
      totalBurgerPrice,
      error,
      selectedIngredients,
      burgerIngredients,
      drinkIngredients,
      sideIngredients,
      load,
      handleSubmit,
      showSelectBurger,
      showSelectDrink,
      showSelectSide,
      invalidForm,
      addIngredientMenuOpen,
      closeNewOrder,
    };
  },
};
</script>

<style>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
button.close {
  border: 2px solid white;
  color: white;
  background: none;
}
label.addingredientbutton {
  position: fixed;
  border-radius: 50%;
  transition-duration: 0.2s;
  right: 0;
  color: white;
  background: #d32f2f;
  line-height: 50px;
  height: 50px;
  width: 50px;
}
#addIngredientButton[type="checkbox"]:checked + label {
  transform: rotate(45deg);
}
</style>