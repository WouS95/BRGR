<template>
  <div class="editIngredients">
        <router-link class="menu-item" :to="{name: 'Burgers'}"> Burgers </router-link>
        <router-link :to="{name: 'Breads'}"> Buns </router-link>
        <router-link :to="{name: 'Sauces'}"> Sauces </router-link>
        <router-link :to="{name: 'Toppings'}"> Toppings </router-link>
        <router-link :to="{name: 'Sides'}"> Side items </router-link>
        <router-link :to="{name: 'Drinks'}"> Drinks </router-link>
  <router-view/> 
      </div>
</template>

<script>
export default {

}
</script>

<style>
.menu-item{
    text-align: center;
    background: white;
    color: black;
    font-size: 16px;
    border-radius: 5px;
    border: black;
}
</style>