<template>
  <div class="editIngredients">
        <router-link class="menu-item" :to="{name: 'Burgers'}"> Burgers </router-link>
        <router-link class="menu-item" :to="{name: 'Breads'}"> Buns </router-link>
        <router-link class="menu-item" :to="{name: 'Sauces'}"> Sauces </router-link>
        <router-link class="menu-item" :to="{name: 'Toppings'}"> Toppings </router-link>
        <router-link class="menu-item" :to="{name: 'Sides'}"> Side items </router-link>
        <router-link class="menu-item" :to="{name: 'Drinks'}"> Drinks </router-link>
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
    background: rgb(0, 73, 10);
    color: rgb(255, 255, 255);
    font-size: 16px;
    border-radius: 10px;
    padding: 3px 15px;
    margin-left: 20px;
    text-decoration: none;
}
</style>