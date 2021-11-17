<template>
  <h1>New Order</h1>
  <div class="createNewOrder">
    <button @click="closeNewOrder"><span class="material-icons">cancel</span> Cancel</button>
    <button @click="handleOrderSubmit">Checkout <span class="material-icons">shopping_cart</span></button>

    <div>
      <div v-for="orderItem in order" :key="orderItem.type">
        <div class="container burgerItem" v-if="orderItem.type == 'burger'">
          <h3>{{ orderItem.ingredients[0].name }} burger</h3>
          <p class="subtitle">€{{ parseFloat(orderItem.price).toFixed(2).replace(/\./g, ",") }}</p>
           <p> {{ orderItem.ingredients[1].name }} bread</p>
           <div v-for="ingredient in orderItem.ingredients.splice(2)" :key="ingredient.name">
            <p>{{ ingredient.name}}</p>
            </div>
        </div>
        <div v-else class="container">
            <h3> {{orderItem.name}}</h3>
            <p class="subtitle">€{{ parseFloat(orderItem.price).toFixed(2).replace(/\./g, ",") }}</p>
        </div>
    </div>
    </div>

    <!-- Adding a new burger -->
    <button v-if="isCreatingBurger" @click="isCreatingBurger = false"> Cancel Burger</button>
    <button v-else @click="isCreatingBurger = true"> Create Burger</button>
    <form @submit.prevent="handleBurgerSubmit" class="container" v-if="isCreatingBurger">
      <label for="burgerPatty">Select a patty:</label>
        <select name="burgerPatty" v-model="creatingBurger.patty">
            <option v-for="burgerPatty in restaurantIngredients[0].burgerPatty" :key="burgerPatty.name" :value="burgerPatty"> {{ burgerPatty.name }} </option>
        </select>
        <br>
        <label for="burgerBread">Select a bun:</label>
        <select name="burgerBread" v-model="creatingBurger.bread">
            <option v-for="bread in restaurantIngredients[0].breads" :key="bread.name" :value="bread"> {{ bread.name }} </option>
        </select>
        <br>
        <p class="selectTitle">Select toppings:</p>
        <div v-for="topping in restaurantIngredients[0].toppings" :key="topping.name">
          <label for="topping.name">{{ topping.name }} </label>
          <input type="checkbox"  v-model="creatingBurger.toppings" :value="topping">
        </div>

        <p class="selectTitle">Select sauces:</p>
        <div v-for="sauce in restaurantIngredients[0].sauces" :key="sauce.name">
          <label for="sauce.name">{{ sauce.name }} </label>
          <input type="checkbox"  v-model="creatingBurger.sauces" :value="sauce">
        </div>
        <br>
        Total: €{{ parseFloat(totalBurgerPrice).toFixed(2).replace(/\./g, ",") }}
        <button :disabled="invalidForm" >Add burger</button>
    </form>
    
 <!-- Adding a new side -->
    <button v-if="isAddingSide" @click="isAddingSide = false">Cancel</button>
    <button v-else @click="isAddingSide = true">Add side</button>
    <form @submit.prevent="handleSideSubmit" class="container" v-if="isAddingSide">
      <div v-for="side in restaurantIngredients[2].sides" :key="side.name">
          <label> {{ side.name }} </label>
          <input type="radio"  v-model="newSide" :value="side">
        </div>
        <button>Add side</button>
    </form>

    <!-- Adding a new drink -->
    <button v-if="isAddingDrink" @click="isAddingDrink = false">Cancel</button>
    <button v-else @click="isAddingDrink = true">Add drink</button>
    <form @submit.prevent="handleDrinkSubmit" class="container" v-if="isAddingDrink">
      <div v-for="drink in restaurantIngredients[1].drinks" :key="drink.name">
          <label> {{ drink.name }} </label>
          <input type="radio"  v-model="newDrink" :value="drink">
        </div>
        <button>Add drink</button>
    </form>

    {{ order }}
  </div>
  

</template>

<script>
import { computed, ref } from "vue";
import { projectFirestore, timestamp } from "../../firebase/config";
import getIngredients from '../../composables/getIngredients'

export default {
  props: ["tableNr"],
  emits: ["closeNewOrder"],
  setup(props, context){
    const order = ref([])
    const tableNumber = props.tableNr

    const isCreatingBurger = ref(false)
    const isAddingDrink = ref(false)
    const isAddingSide = ref(false)

    const newDrink = ref(null)
    const newSide = ref(null)
    
    const creatingBurger = ref({
      patty: null,
      bread: null,
      toppings: [],
      sauces: [],
      type: 'burger'
    })

    const invalidForm = computed(() => {
      return (
        creatingBurger.value.patty == null ||
        creatingBurger.value.bread == null
      )
    })

    const closeNewOrder = () => {
      context.emit("closeNewOrder");
    };

    const handleBurgerSubmit = () => {
      creatingBurger.value.price = totalBurgerPrice.value

      let newBurger = {
        type: 'burger',
        price: totalBurgerPrice.value,
        ingredients: []
      }


      newBurger.ingredients.push(creatingBurger.value.patty)
      console.log(creatingBurger.value.patty)
      newBurger.ingredients.push(creatingBurger.value.bread)
      console.log(creatingBurger.value.sauces[0])
      newBurger.ingredients.push(creatingBurger.value.sauces[0])

      console.log("ingredients", newBurger.ingredients)
     
      // pushes the burger into the order array
      order.value.push(newBurger)
      // empties the burger form
      creatingBurger.value = {
        patty: null,
        bread: null,
        toppings: [],
        sauces: [],
        type: 'burger'
      }
      // closes the burger creation window
      isCreatingBurger.value = false
    }

    const handleDrinkSubmit = () => {
      let drink = newDrink.value
      drink.type = 'drink'
      order.value.push(drink)

      isAddingDrink.value = false
    }

    const handleSideSubmit = () => {
      let side = newSide.value
      side.type = 'side'
      order.value.push(side)

      isAddingSide.value = false
    }

    let getLastOrderId = async () => {
      let result;
      try {
        const res = await projectFirestore
          .collection("orders")
          .orderBy("orderNr", "desc")
          .limit(1)
          .get();
        result = res.docs.map((doc) => {
          return doc.data().orderNr;
        });
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
      return result[0];
    }

    const totalBurgerPrice = computed(() => {
      var price = 0;
      if (creatingBurger.value.sauces[0]) {
        creatingBurger.value.sauces.forEach((element) => {
          price += Number(element.price);
        });
      }
      if (creatingBurger.value.toppings[0]) {
        creatingBurger.value.toppings.forEach((element) => {
          price += Number(element.price);
        });
      }
      if (creatingBurger.value.bread) {
        price += Number(creatingBurger.value.bread.price);
      }
      if (creatingBurger.value.patty) {
        price += Number(creatingBurger.value.patty.price);
      }
      return price;
    });

    const handleOrderSubmit = async () => {

      let newOrder = {
        orderNr: (await getLastOrderId()) + 1,
        orderStatus: 'preparing',
        orderTime: timestamp(),
        tableNr: Number(tableNumber),
      }
      newOrder.order = order.value
      const res = await projectFirestore.collection("orders").add(newOrder);


    
    }


    const {restaurantIngredients, error, load} = getIngredients()
    load()
    console.log(restaurantIngredients)

    return{
      closeNewOrder,
      isCreatingBurger,
      restaurantIngredients,
      error,
      creatingBurger,
      order,
      handleBurgerSubmit,
      isAddingDrink,
      isAddingSide,
      newDrink,
      newSide,
      handleDrinkSubmit,
      handleSideSubmit,
      invalidForm,
      handleOrderSubmit,
      totalBurgerPrice

    }
  }
}
</script>

<style>
  .createNewOrder {
    width: 80%;
    margin: auto;
    margin-bottom: 300px;
    min-width: 300px;
  }

  .createNewOrder select {
    margin-bottom: 30px;
    font-size: 1em;
    padding: 10px 35px;
  }

  .createNewOrder .container {
    background: #FFF;
    padding: 30px 0px;
    margin-bottom: 20px;
    border-radius: 10px;
  }

  .createNewOrder .selectTitle {
    margin-bottom: 0px;
    font-weight: 600;
  }

  .createNewOrder button {
    display: block;
    margin: auto;
    margin-bottom: 10px;
  }
  
  .createNewOrder .burgerItem p {
    margin: 0px;
  }

  .createNewOrder .burgerItem h3 {
    margin: 0px;
    margin-bottom: 5px;
  }

  .createNewOrder h3 {
    margin: 0px;
  }

  .createNewOrder button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>