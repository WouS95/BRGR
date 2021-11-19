<template>
<RestaurantHeader/>
  <h1 class="ingredientsHeader">Ingredients</h1>
  <div class="menuedits">
    <edit-ingredients-menu type="Toppings"/>
    <button class="add-new-ingredient" @click="addingMenuItem = true"><span class="material-icons">add</span> Add</button>
    <div class="menuitem" v-for="(topping, index) in toppings" :key="topping.id">
      <img v-if="topping.image" :src="topping.image">
      <span class="menuitem-name"> {{ topping.name }}</span>
       € {{ Number.parseFloat(topping.price).toFixed(2) }}
      <span class="material-icons" @click="editItem(topping, index)">edit</span>
      <span class="material-icons" @click="removeItem(topping, index)"> delete </span>
      <label class="subtitle"> Available: </label>
      <label class="switch">
        <input
          v-model="topping.isAvailable"
          type="checkbox"
          @click="changeAvailability(topping, index)"
        />
        <span class="slider round"></span>
      </label>
    </div>
  </div>
    <add-menu-item
      type="toppings"
      v-if="addingMenuItem"
      @cancel="addingMenuItem = false"
      @addToFirebase="addMenuItemToFirebase($event)"
    />
  <edit-menu-item
    v-if="editingMenuItem"
    :itemToEdit="menuItemToEdit"
    @save-changes="updateDB($event)"
    @cancel="editingMenuItem = false"
  />
</template>

<script>
import EditIngredientsMenu from "../../../components/EditIngredientsMenu.vue";
import { fieldValue, projectFirestore } from "../../../firebase/config";
import { ref } from "vue";
import EditMenuItem from "../../../components/EditMenuItem.vue";
import AddMenuItem from "../../../components/AddMenuItem.vue";
import RestaurantHeader from '../../../components/restaurant/RestaurantHeader.vue'

export default {
  name: "Toppings",
  components: {
    EditIngredientsMenu,
    EditMenuItem,
    AddMenuItem,
    RestaurantHeader
  },
  setup() {
    const toppings = ref([]);
    const error = ref(null);

    const load = async () => {
      try {
        const res = await projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .get();
        var toppingsDB = { ...res.data().toppings };

        for (const toppingDB in toppingsDB) {
          const topping = toppingsDB[toppingDB];
          toppings.value.push(topping);
        }
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
    };

      let addingMenuItem = ref(false);
      let editingMenuItem = ref(false);
      let menuItemToEdit = ref({});
      let editIndex = ref(null);

    const editItem = (itemToEdit, index) => {
      editingMenuItem.value = true;
      menuItemToEdit.value = itemToEdit;
      editIndex.value = index;

    } 

    const updateDB = (newValuesIngredient) => {
      editingMenuItem.value = false;
      toppings.value[editIndex.value]=newValuesIngredient

        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
          toppings: fieldValue.arrayRemove(menuItemToEdit.value),
        })
       
        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
            toppings: fieldValue.arrayUnion(newValuesIngredient),
        })
    
    }

    const addMenuItemToFirebase = (menuItemToAdd) => {
      toppings.value.push(menuItemToAdd);
      addingMenuItem.value = false;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          toppings: fieldValue.arrayUnion(menuItemToAdd),
        });
    }

    const removeItem = (menuItemToRemove, index) => {
        toppings.value.splice(index, 1);
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            toppings: fieldValue.arrayRemove(menuItemToRemove),
          });
      } 

      const changeAvailability = (topping, index) => {
        let newAvailibility = !topping.isAvailable;
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            toppings: fieldValue.arrayRemove(topping),
          });

        toppings.value[index].isAvailable = newAvailibility;
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            toppings: fieldValue.arrayUnion(topping),
          });
      }

    load();
    return {
      toppings, editingMenuItem, menuItemToEdit, editIndex, addingMenuItem, editItem, updateDB, changeAvailability, removeItem, addMenuItemToFirebase
    };
  },
};
</script>

<style>

</style>