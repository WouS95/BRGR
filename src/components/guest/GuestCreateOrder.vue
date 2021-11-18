<template>
  <h1>New Order</h1>
  <h3>
    Total: €{{ parseFloat(totalOrderPrice).toFixed(2).replace(/\./g, ",") }}
  </h3>
  <div class="cancelAndCheckoutButtons">
    <span class="close" @click="closeNewOrder">
      <span class="material-icons">highlight_off</span> Cancel
    </span>
    <button :disabled="invalidForm" @click="checkoutOrder">
      <span class="material-icons">shopping_cart</span> Checkout
    </button>
  </div>
  <div
    @click="addIngredientMenuOpen = false"
    :class="{ backdrop: addIngredientMenuOpen }"
  ></div>
  <div v-if="burgerIngredients">
    <div
      @click="
        showSelectBurger = false;
        showSelectDrink = false;
        showSelectSide = false;
      "
      :class="{ backdrop: showSelectBurger || showSelectDrink }"
    ></div>
    <form
      id="addBurgerForm"
      v-show="showSelectBurger"
      @submit.prevent="addBurgerToOrder"
    >
      <h1>Create your burger</h1>
      <span @click="showSelectBurger = false" class="close">Cancel</span>
      <h2>add bread</h2>
      <div
        v-for="(breads, index) in burgerIngredients.breads"
        :key="breads.name"
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
        <label v-if="breads.isAvailable" :for="'bread' + index">
          <span class="orderItemName">{{ breads.name }} bread</span>
          <span class="orderItemPrice"
            >€
            {{ parseFloat(breads.price).toFixed(2).replace(/\./g, ",") }}</span
          ></label
        >
      </div>
      <h2>add patty</h2>
      <div
        v-for="(pattys, index) in burgerIngredients.burgerPatty"
        :key="pattys.name"
      >
        <input
          required
          v-if="pattys.isAvailable"
          v-model="selectedIngredients.burger.patty"
          :value="pattys"
          type="radio"
          name="patty"
          :id="'patty' + index"
        /><label v-if="pattys.isAvailable" :for="'patty' + index"
          >{{ pattys.name }} patty</label
        >
      </div>
      <h2>Select your toppings</h2>
      <div
        v-for="(toppings, index) in burgerIngredients.toppings"
        :key="toppings.name"
      >
        <input
          v-if="toppings.isAvailable"
          v-model="selectedIngredients.burger.toppings"
          type="checkbox"
          name="topping"
          :id="'topping' + index"
          :value="toppings"
        /><label v-if="toppings.isAvailable" :for="'topping' + index">{{
          toppings.name
        }}</label>
      </div>
      <h2>Select your sauces</h2>
      <div
        v-for="(sauces, index) in burgerIngredients.sauces"
        :key="sauces.name"
      >
        <input
          v-if="sauces.isAvailable"
          v-model="selectedIngredients.burger.sauces"
          type="checkbox"
          name="sauce"
          :id="'sauce' + index"
          :value="sauces"
        /><label v-if="sauces.isAvailable" :for="'sauce' + index">{{
          sauces.name
        }}</label>
      </div>
      <button>Add burger to order</button>
    </form>
    <!-- form to add new burger -->
    <!-- step 1: select patty -->
    <!-- step 2: select bread -->
    <!-- step 3: select topping -->
    <!-- step 4: select sauce -->

    <form
      id="addDrinkForm"
      v-show="showSelectDrink"
      @submit.prevent="addDrinkToOrder"
    >
      <h2>Select your drink</h2>
      <span @click="showSelectDrink = false" class="close">Cancel</span>
      <div
        v-for="(drinks, index) in drinkIngredients.drinks"
        :key="drinks.name"
      >
        <input
          v-if="drinks.isAvailable"
          v-model="selectedIngredients.drink"
          type="radio"
          name="drink"
          :id="'drink' + index"
          :value="drinks"
        /><label v-if="drinks.isAvailable" :for="'drink' + index">{{
          drinks.name
        }}</label>
      </div>
      <button>Add drink to order</button>
    </form>
    <!-- form to add new drink -->

    <form
      id="addSideForm"
      v-show="showSelectSide"
      @submit.prevent="addSideToOrder"
    >
      <h2>Select your side</h2>
      <span @click="showSelectSide = false" class="close">Cancel</span>
      <div v-for="(sides, index) in sideIngredients.sides" :key="sides.name">
        <input
          v-if="sides.isAvailable"
          v-model="selectedIngredients.sides"
          type="radio"
          name="side"
          :id="'side' + index"
          :value="sides"
        /><label v-if="sides.isAvailable" :for="'side' + index">{{
          sides.name
        }}</label>
      </div>
      <button>Add side to order</button>
    </form>
    <!-- form to add new side -->
    <ul id="checkoutOrders">
      <li
        class="orderItem"
        v-for="(orderItem, index) in fullOrder.order"
        :key="index"
      >
        <h3 v-if="orderItem.type == 'burger'">
          {{ orderItem.ingredients[0].name }} burger
        </h3>
        <h3 v-else>{{ orderItem.name }}</h3>
        <div v-if="orderItem.type == 'burger'">
          <p v-for="ingredient in orderItem.ingredients" :key="ingredient.name">
            {{ ingredient.name }}
          </p>
        </div>
        <span class="priceTag"> € {{ orderItem.price }} </span>
        <i class="delete material material-icons" @click="removeItem(orderItem)"
          >delete</i
        >
      </li>
    </ul>
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
          <span class="material-icons"> lunch_dining </span> Burger
        </p>
        <p
          @click="
            showSelectDrink = true;
            addIngredientMenuOpen = false;
          "
        >
          <span class="material-icons"> local_drink </span> Drink
        </p>
        <p
          @click="
            showSelectSide = true;
            addIngredientMenuOpen = false;
          "
        >
          <span class="material-icons"> takeout_dining </span>

          Side
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
    </nav>
    <div v-if="!fullOrder.order[0]">
      Add your first order by clicking the plus icon
    </div>
    <div :class="{ backdrop: orderCheckoutSuccess }"></div>
    <div id="orderSuccessModal" v-if="orderCheckoutSuccess">
      <h2>Order placed!</h2>
      <p>Your order number is:</p>
      <h2 class="orderNumber">{{ orderNumber }}</h2>
      <p>
        You can pick up your order at the bar when it is
        <span class="status green"
          ><span class="statusSphere"></span>
          <span class="statusText">Ready</span>
        </span>
      </p>
      <button @click="closeNewOrder">Okay</button>
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
    const orderNumber = ref(null);
    const showSelectBurger = ref(false);
    const orderCheckoutSuccess = ref(false);
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
        price: Number(totalBurgerPrice()),
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
      console.log(fullOrder.value);
      selectedIngredients.value = {
        burger: {
          bread: null,
          patty: null,
          sauces: [],
          toppings: [],
        },
        drink: null,
        sides: [],
      };
      showSelectBurger.value = false;
    };
    const addDrinkToOrder = () => {
      const orderResult = {
        name: selectedIngredients.value.drink.name,
        price: Number(selectedIngredients.value.drink.price),
        type: "drink",
      };
      fullOrder.value.order.push(orderResult);
      console.log(fullOrder);
      selectedIngredients.value = {
        burger: {
          bread: null,
          patty: null,
          sauces: [],
          toppings: [],
        },
        drink: null,
        sides: [],
      };
      showSelectDrink.value = false;
    };

    const addSideToOrder = () => {
      const orderResult = {
        name: selectedIngredients.value.sides.name,
        price: Number(selectedIngredients.value.sides.price),
        type: "side",
      };
      fullOrder.value.order.push(orderResult);
      console.log(fullOrder);
      selectedIngredients.value = {
        burger: {
          bread: null,
          patty: null,
          sauces: [],
          toppings: [],
        },
        drink: null,
        sides: [],
      };
      showSelectSide.value = false;
    };

    const removeItem = (item) => {
      const index = fullOrder.value.order.indexOf(item);
      fullOrder.value.order.splice(index, 1);
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
          // console.log(doc.data().orderNr);
          return doc.data().orderNr;
        });
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
      return result[0];
    };
    const checkoutOrder = async () => {
      // console.log("ckecking out", fullOrder.value.order);
      const res = JSON.stringify(fullOrder.value.order);
      const orderData = {
        order: JSON.parse(res),
        orderNr: (await getLastOrderId()) + 1,
        orderStatus: "preparing",
        orderTime: timestamp(),
        tableNr: Number(tableNumber),
      };

      console.log(orderData);
      const query = await projectFirestore.collection("orders").add(orderData);
      orderCheckoutSuccess.value = true;
      orderNumber.value = orderData.orderNr;
    };
    const invalidForm = computed(() => {
      // if (fullOrder.value.order.includes("burger")) {
      //   return false;
      // }
      // const res = JSON.stringify(fullOrder.value.order);
      return !JSON.stringify(fullOrder.value.order).includes('"type":"burger"');
    });
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
    const totalOrderPrice = computed(() => {
      let price = 0;
      fullOrder.value.order.forEach((element) => {
        price += element.price;
      });
      return price;
    });
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
      checkoutOrder,
      invalidForm,
      orderNumber,
      orderCheckoutSuccess,
      removeItem,
      totalOrderPrice,
    };
  },
};
</script>

<style>
.cancelAndCheckoutButtons {
  display: flex;
  justify-content: space-between;
}
.backdrop {
  z-index: 1;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.close {
  font-family: Poppins, Helvetica, Arial, sans-serif;
  color: white;
  padding: 0.55em 1em 0.6em 1em;
  border-radius: 2em;
  cursor: pointer;
  font-weight: 500;
  font-size: 100%;
  box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 15%);
  border: 2px solid white;
  background: none;
}
#addIngredientMenuWithToggleButton {
  position: fixed;
  bottom: 200px;
  right: 80px;
  z-index: 1;
}
#addBurgerForm,
#addDrinkForm,
#addSideForm {
  position: fixed;
  top: 0;
  left: 0;
  overflow: scroll;
  padding: 30px;
  width: 100%;
  height: 100%;
  background: #1b5e20;
  z-index: 2;
}
#checkoutOrders {
  list-style: none;
  padding: 0;
}
#checkoutOrders .orderItem {
  background: white;
  margin: 20px auto;
  border-radius: 10px;
  padding: 20px 30px;
  text-align: left;
}
#checkoutOrders .orderItem .delete {
  float: right;
}
#addIngredientMenu {
  position: absolute;
  right: -250px;
  bottom: 0;
  transition: all 0.2s ease;
  color: white;
}
nav.active #addIngredientMenu {
  transform: translate(-200px);
}
#addIngredientMenu p {
  padding: 10px 20px;
  border-radius: 50px;
  background: #1b5e20;
  box-shadow: #00000026 0 3px 10px;
  text-align: right;
}
label.addingredientbutton {
  position: fixed;
  border-radius: 50%;
  transition-duration: 0.2s;
  font-size: 150%;
  color: white;
  background: #d32f2f;
  line-height: 56px;
  height: 56px;
  width: 56px;
  text-align: center;
}
#addIngredientButton[type="checkbox"]:checked + label {
  transform: rotate(45deg);
}
#addBurgerForm input:checked + label,
#addDrinkForm input:checked + label,
#addSideForm input:checked + label {
  font-weight: bold;
}
#addBurgerForm input + label,
#addDrinkForm input + label,
#addSideForm input + label {
  background: white;
}
#orderSuccessModal {
  background: white;
  position: fixed;
  z-index: 1;
  left: 50%;
  top: 10%;
  transform: translate(-50%);
  text-align: left;
  padding: 30px 50px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
}
h2.orderNumber {
  font-size: 2.2em;
  line-height: 1em;
  font-weight: 600;
  margin-bottom: 20px;
}
#addBurgerForm input,
#addDrinkForm input,
#addSideForm input {
  opacity: 0;
  margin-right: -13px;
  margin-top: -13px;
}
.orderItemName,
.orderItemPrice {
  display: block;
}
</style>