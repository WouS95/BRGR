<template>
  <div class="orderItem">
      <div class="itemText" v-if="orderItem.type == 'burger'">
        <h3>{{orderItem.ingredients[0].name }} {{ orderItem.type }}</h3>
        <p>{{ orderItem.ingredients[1].name }} bread</p>
        <div v-for="ingredient in orderItem.ingredients.splice(2)" :key="ingredient.name">
          <p>{{ ingredient.name }}</p>
        </div>
      </div>
      <div class="itemText" v-else>
        {{ orderItem.name }}
      </div>
      <div class="itemBottomBorder bottomBorder"/>
  </div>
</template>

<script>
export default {
  props: ['orderItem'],
  setup(props){
  }
}
</script>

<style>
.orderItem {
  margin: 20px 0px;
}

.orderItem .itemText {
  margin-bottom: 10px;
}

.orderItem .bottomBorder.itemBottomBorder {
  margin: 0px;
  width: 50%;
}

</style>