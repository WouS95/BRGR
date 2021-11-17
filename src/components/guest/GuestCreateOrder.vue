<template>
  <h1>New Order</h1>
  <button class="close" @click="closeNewOrder">Cancel</button>
  <button @click="checkoutOrder">Checkout</button>
  <div class="backdrop" :class="{ active: addIngredientMenuOpen }"></div>
  <div v-if="burgerIngredients">
    <div
      @click="
        showSelectBurger = false;
        showSelectDrink = false;
      "
      class="backdrop"
      :class="{ active: showSelectBurger || showSelectDrink }"
    ></div>
    <form v-show="showSelectBurger" @submit.prevent="addBurgerToOrder">
      <h2>add bread</h2>
      <div
        v-for="(breads, index) in burgerIngredients.breads"
        :key="breads.name"
      >
        <label v-if="breads.isAvailable" :for="'bread' + index"
          >{{ breads.name }} bread</label
        >
        <input
          required
          v-if="breads.isAvailable"
          v-model="selectedIngredients.burger.bread"
          :value="breads"
          type="radio"
          name="bread"
          :id="'bread' + index"
        />
      </div>
      <h2>add patty</h2>
      <div
        v-for="(pattys, index) in burgerIngredients.burgerPatty"
        :key="pattys.name"
      >
        <label v-if="pattys.isAvailable" :for="'patty' + index"
          >{{ pattys.name }} patty</label
        >
        <input
          required
          v-if="pattys.isAvailable"
          v-model="selectedIngredients.burger.patty"
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
          v-model="selectedIngredients.burger.toppings"
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
          v-model="selectedIngredients.burger.sauces"
          type="checkbox"
          name="sauce"
          :id="'sauce' + index"
          :value="sauces"
        />
      </div>
      <button>Add burger to order</button>
    </form>
    <!-- form to add new burger -->
    <!-- step 1: select patty -->
    <!-- step 2: select bread -->
    <!-- step 3: select topping -->
    <!-- step 4: select sauce -->

    <form v-show="showSelectDrink" @submit.prevent="addDrinkToOrder">
      <h2>Select your drink</h2>
      <div
        v-for="(drinks, index) in drinkIngredients.drinks"
        :key="drinks.name"
      >
        <label v-if="drinks.isAvailable" :for="'drink' + index">{{
          drinks.name
        }}</label>
        <input
          v-if="drinks.isAvailable"
          v-model="selectedIngredients.drink"
          type="radio"
          name="drink"
          :id="'drink' + index"
          :value="drinks"
        />
      </div>
      <button>Add drink to order</button>
    </form>
    <!-- form to add new drink -->

    <form v-show="showSelectSide" @submit.prevent="addSideToOrder">
      <h2>Select your side</h2>
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
      <button>Add side to order</button>
    </form>
    <!-- form to add new side -->
    <div id="checkoutOrders">
      <div
        class="orderItem"
        v-for="(orderItem, index) in fullOrder.order"
        :key="index"
      >
        {{ orderItem }}
      </div>
    </div>
    <nav
      id="addIngredientMenuWithToggleButton"
      class="backgroundOverlay"
      :class="{ active: addIngredientMenuOpen }"
    >
      <div id="addIngredientMenu">
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
      <input
        hidden
        id="addIngredientButton"
        type="checkbox"
        class="addbutton"
        v-model="addIngredientMenuOpen"
      />
      <label for="addIngredientButton" class="addingredientbutton">+</label>
    </nav>
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
    const showSelectBurger = ref(false);
    const showSelectDrink = ref(false);
    const showSelectSide = ref(false);
    const selectedIngredients = ref({
      burger: {
        bread: null,
        patty: null,
        sauces: [],
        toppings: [],
      },
      drink: null,
      sides: [],
    });
    const fullOrder = ref({
      order: [],
      orderNr: null,
      orderStatus: "preparing",
      orderTime: timestamp(),
      tableNr: Number(tableNumber),
    });
    // const burgerIngredients = ref(false);
    // const totalBurgerPrice = ref(null);
    const error = ref(null);
    const addBurgerToOrder = () => {
      const orderResult = {
        ingredients: [],
        price: totalBurgerPrice(),
        type: "burger",
      };
      // first add the bread and patty in ingredients array
      orderResult.ingredients.push(
        {
          name: selectedIngredients.value.burger.patty.name,
          type: "burgerPatty",
        },
        {
          name: selectedIngredients.value.burger.bread.name,
          type: "bread",
        }
      );
      // add toppings
      for (
        let i = 0;
        i < selectedIngredients.value.burger.toppings.length;
        i++
      ) {
        orderResult.ingredients.push({
          name: selectedIngredients.value.burger.toppings[i].name,
          type: "topping",
        });
      }
      // add sauces
      for (let i = 0; i < selectedIngredients.value.burger.sauces.length; i++) {
        orderResult.ingredients.push({
          name: selectedIngredients.value.burger.sauces[i].name,
          type: "sauce",
        });
      }
      fullOrder.value.order.push(orderResult);
      // add populated order to full order object
      console.log(fullOrder);
    };
    const addDrinkToOrder = () => {
      const orderResult = {
        name: selectedIngredients.value.drink.name,
        price: selectedIngredients.value.drink.price,
        type: "drink",
      };
      fullOrder.value.order.push(orderResult);
      console.log(fullOrder);
    };
    const addSideToOrder = () => {
      const orderResult = [];
      for (let i = 0; i < selectedIngredients.value.sides.length; i++) {
        orderResult.push({
          name: selectedIngredients.value.sides[i].name,
          price: selectedIngredients.value.sides[i].price,
          type: "side",
        });
      }
      fullOrder.value.order.push(orderResult);
      console.log(fullOrder.value);
    };

    const closeNewOrder = () => {
      context.emit("closeNewOrder");
    };

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
    const totalBurgerPrice = () => {
      var price = 0;
      if (selectedIngredients.value.burger.sauces[0]) {
        selectedIngredients.value.burger.sauces.forEach((element) => {
          price += Number(element.price);
        });
      }
      if (selectedIngredients.value.burger.toppings[0]) {
        selectedIngredients.value.burger.toppings.forEach((element) => {
          price += Number(element.price);
        });
      }
      if (selectedIngredients.value.burger.bread) {
        price += Number(selectedIngredients.value.burger.bread.price);
      }
      if (selectedIngredients.value.burger.patty) {
        price += Number(selectedIngredients.value.burger.patty.price);
      }
      return price;
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
      addBurgerToOrder,
      addDrinkToOrder,
      addSideToOrder,
      burgerIngredients,
      sideIngredients,
      drinkIngredients,
      closeNewOrder,
      selectedIngredients,
      getLastOrderId,
      showSelectBurger,
      showSelectSide,
      showSelectDrink,
      addIngredientMenuOpen,
      fullOrder,
    };
  },
};
</script>

<style>
.backdrop.active {
  position: fixed;
  background: black;
  opacity: 0.5;
  width: 100vw;
  height: 100vh;
  top: 0;
  z-index: 0;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
button.close {
  border: 2px solid white;
  color: white;
  background: none;
}
#addIngredientMenuWithToggleButton {
  position: fixed;
  bottom: 100px;
  right: 0;
}
form {
  position: relative;
  background: white;
}
#checkoutOrders .orderItem {
  background: white;
  width: 60%;
  margin: 20px auto;
}
#addIngredientMenu {
  position: absolute;
  right: -100px;
  bottom: 0;
  transition: all 0.2s ease;
}
nav.active #addIngredientMenu {
  transform: translate(-110px);
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