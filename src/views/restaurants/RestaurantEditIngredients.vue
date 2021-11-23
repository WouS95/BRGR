<template>
<RestaurantHeader/>
<div class="menuedits">
      <div class="menu-bar">
        <span :class="{currentpage: 'burgerPatty'=== type}" class="menu-item" @click="type='burgerPatty'"> Burgers </span>
        <span :class="{currentpage: 'breads'=== type}" class="menu-item" @click="type='breads'"> Buns </span>
        <span :class="{currentpage: 'toppings'=== type}" class="menu-item" @click="type='toppings'"> Toppings </span>
        <span :class="{currentpage: 'sauces'=== type}" class="menu-item" @click="type='sauces'"> Sauces </span>
        <span :class="{currentpage: 'sides'=== type}" class="menu-item" @click="type='sides'"> Side items </span>
        <span :class="{currentpage: 'drinks'=== type}" class="menu-item" @click="type='drinks'"> Drinks </span>
    </div>
    <ShowIngredients v-if="type === 'burgerPatty' " :ingredientType="type" documentName="burgerIngredients" :ingredientList="burgerPattyList"/>
    <ShowIngredients v-if="type === 'breads' " :ingredientType="type" documentName="burgerIngredients" :ingredientList="breadsList"/>
    <ShowIngredients v-if="type === 'toppings' " :ingredientType="type" documentName="burgerIngredients" :ingredientList="toppingsList"/>
    <ShowIngredients v-if="type === 'sauces' " :ingredientType="type" documentName="burgerIngredients" :ingredientList="saucesList"/>
    <ShowIngredients v-if="type === 'sides' " :ingredientType="type" documentName="sides" :ingredientList="sidesList"/>
    <ShowIngredients v-if="type === 'drinks' " :ingredientType="type" documentName="drinks" :ingredientList="drinksList"/>
</div>
</template>

<script>
import RestaurantHeader from '../../components/restaurant/RestaurantHeader.vue';
import ShowIngredients from '../../components/restaurant/RestaurantShowIngredients.vue'
import { projectFirestore } from "../../firebase/config";
import { ref } from "vue";

export default {
  name: "EditIngredients",
  components: {
    RestaurantHeader,
    ShowIngredients  
  },
  data(){
      return{
          type: "burgerPatty",
          theingredientList: []
      }
  },
    setup(){
        const burgerPattyList = ref([]);
        const breadsList = ref([]);
        const saucesList = ref([]);
        const toppingsList = ref([]);
        const drinksList = ref([]);
        const sidesList = ref([]);
        const error = ref(null);
        
        const loadIngredientsLists = async () => {
        try {
            const res = await projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .get();
            var burgerPattysFromDB = { ...res.data().burgerPatty};
            var breadsFromDB = { ...res.data().breads};
            var saucesFromDB = { ...res.data().sauces};
            var toppingsFromDB = { ...res.data().toppings};

        for (const burgerPattyFromDB in burgerPattysFromDB) {
          const burgerPatty = burgerPattysFromDB[burgerPattyFromDB];
          burgerPattyList.value.push(burgerPatty);
        }
        for (const breadFromDB in breadsFromDB) {
          const bread = breadsFromDB[breadFromDB];
          breadsList.value.push(bread);
        }
        for (const sauceFromDB in saucesFromDB) {
          const sauce = saucesFromDB[sauceFromDB];
          saucesList.value.push(sauce);
        }
        for (const toppingFromDB in toppingsFromDB) {
          const topping = toppingsFromDB[toppingFromDB];
          toppingsList.value.push(topping);
        }
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
    };

    const loadDrinksList = async () => {
        try {
            const res = await projectFirestore
          .collection("ingredients")
          .doc("drinks")
          .get();
             var drinksFromDB = { ...res.data().drinks};

        for (const drinkFromDB in drinksFromDB) {
          const drink = drinksFromDB[drinkFromDB];
          drinksList.value.push(drink);
        }
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
    };

    const loadSidesList = async () => {
        try {
            const res = await projectFirestore
          .collection("ingredients")
          .doc("sides")
          .get();
           var sidesFromDB = { ...res.data().sides};

        for (const sideFromDB in sidesFromDB) {
          const side = sidesFromDB[sideFromDB];
          sidesList.value.push(side);
        }
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
    };

    loadIngredientsLists()
    loadDrinksList()
    loadSidesList()

    return {
        burgerPattyList,
        breadsList,
        saucesList,
        toppingsList ,
        drinksList,
        sidesList
    }
    }
}
</script>

<style>
.menu-bar{
    margin-bottom: 0.5em;
}
.menu-item{
    text-align: center;
    color: rgb(0, 0, 0);
    font-size: 18px;
    margin-left: 0.75em;
    margin-right: 0.75em;
    text-decoration: none;
}
.currentpage{
    text-decoration: underline;
    text-underline-offset: 0.5em;
    font-weight: bold;
}
</style>