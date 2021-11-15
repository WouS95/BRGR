<template>
  <div class="editIngredients">
        <router-link :class="{currentpage: 'Burgers'=== type}" class="menu-item" :to="{name: 'Burgers'}"> Burgers </router-link>
        <router-link :class="{currentpage: 'Breads'=== type}" class="menu-item" :to="{name: 'Breads'}"> Buns </router-link>
        <router-link :class="{currentpage: 'Sauces'=== type}" class="menu-item" :to="{name: 'Sauces'}"> Sauces </router-link>
        <router-link :class="{currentpage: 'Toppings'=== type}" class="menu-item" :to="{name: 'Toppings'}"> Toppings </router-link>
        <router-link :class="{currentpage: 'Sides'=== type}" class="menu-item" :to="{name: 'Sides'}"> Side items </router-link>
        <router-link :class="{currentpage: 'Drinks'=== type}" class="menu-item" :to="{name: 'Drinks'}"> Drinks </router-link>
  <router-view/> 
  </div>
</template>

<script>
export default {
    props: { type: String }
}
</script>

<style scoped>
.menu-item{
    text-align: center;
    color: rgb(0, 0, 0);
    font-size: 16px;
    margin-left: 2px;
    margin-right: 2px;
    text-decoration: none;
}
.currentpage{
    text-decoration: underline;
    font-weight: bold;
}
</style>