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
    <ShowIngredients :ingredientType="type" :documentName="nameOfDocument" :ingredientList="ingredientList"/>
</div>
</template>

<script>
import RestaurantHeader from '../../components/restaurant/RestaurantHeader.vue';
import ShowIngredients from '../../components/restaurant/RestaurantShowIngredients.vue'

export default {
  name: "EditIngredients",
  components: {
    RestaurantHeader,
    ShowIngredients  
  },
  data(){
      return{
          type: "burgerPatty",
      }
  },
  computed:{
        nameOfDocument: function(){
            if (this.type == "burgerPatty" || this.type == "breads" || this.type == "sauces" || this.type == "toppings"){
                return "burgerIngredients"
            }
            else if(this.type == "sides"){
                return "sides"
            }
            else if(this.type == "drinks"){
                return "drinks"
            }
            },

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