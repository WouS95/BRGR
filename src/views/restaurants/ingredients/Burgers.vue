<template>
<RestaurantHeader/>
  <h1 class="ingredientsHeader">Ingredients</h1>
  <div class="menuedits">
    <edit-ingredients-menu type="Burgers" />
    <button class="add-new-ingredient" @click="addingMenuItem = true">
      <span class="material-icons">add</span> Add
    </button>
    <div class="menuitem" v-for="(burger, index) in burgers" :key="burger.id">
      <img v-if="burger.image" :src="burger.image">
      <span class="menuitem-name"> {{ burger.name }} burger </span>
       € {{ Number.parseFloat(burger.price).toFixed(2) }}
      <span class="material-icons" @click="editItem(burger, index)">edit</span>
      <span class="material-icons" @click="removeItem(burger, index)">delete</span>
      <label class="subtitle"> Available: </label>
      <label class="switch">
        <input
          v-model="burger.isAvailable"
          type="checkbox"
          @click="changeAvailability(burger, index)"
        />
        <span class="slider round"></span>
      </label>
    </div>
  </div>
  <add-menu-item
    type="burgers"
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
  name: "Burgers",
  components: {
    EditIngredientsMenu,
    EditMenuItem,
    AddMenuItem,
    RestaurantHeader
  },

  setup() {
    const burgers = ref([]);
    const error = ref(null);

    const load = async () => {
      try {
        const res = await projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .get();
        var burgersDB = { ...res.data().burgerPatty };

        for (const burgerDB in burgersDB) {
          const burger = burgersDB[burgerDB];
          burgers.value.push(burger);
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
    };

    const updateDB = (newValuesIngredient) => {
      editingMenuItem.value = false;
      burgers.value[editIndex.value] = newValuesIngredient;

      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayRemove(menuItemToEdit.value),
        });

      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayUnion(newValuesIngredient),
        });
    };

    const addMenuItemToFirebase = (menuItemToAdd) => {
      burgers.value.push(menuItemToAdd);
      addingMenuItem.value = false;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayUnion(menuItemToAdd),
        });
    };

    const removeItem = (menuItemToRemove, index) => {
      burgers.value.splice(index, 1);
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayRemove(menuItemToRemove),
        });
    };

    const changeAvailability = (burger, index) => {
      let newAvailibility = !burger.isAvailable;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayRemove(burger),
        });

      burgers.value[index].isAvailable = newAvailibility;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayUnion(burger),
        });
    };

    load();

    return {
      burgers,
      editingMenuItem,
      menuItemToEdit,
      editIndex,
      addingMenuItem,
      editItem,
      updateDB,
      changeAvailability,
      removeItem,
      addMenuItemToFirebase,
    };
  },
};
</script>

<style>

</style>