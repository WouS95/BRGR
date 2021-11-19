<template>
<RestaurantHeader/>
<h1 class="burger-ingredients-title">Burger Ingredients </h1>
  <div class="menuedits">
    <edit-ingredients-menu type="Sauces"/>
    <button class="add-new-ingredient" @click="addingMenuItem = true"><span class="material-icons">add</span> Add</button>
    <div class="menuitem" v-for="(sauce, index) in sauces" :key="sauce.id">
      <img v-if="sauce.image" :src="sauce.image">
      <span class="menuitem-name"> {{ sauce.name }}</span>
      € {{ Number.parseFloat(sauce.price).toFixed(2) }}
      <span class="material-icons" @click="editItem(sauce, index)">edit</span>
      <span class="material-icons" @click="removeItem(sauce, index)"> delete </span>
      <label class="subtitle"> Available: </label>
      <label class="switch">
        <input
          v-model="sauce.isAvailable"
          type="checkbox"
          @click="changeAvailability(sauce, index)"
        />
        <span class="slider round"></span>
      </label>
    </div>
  </div>
    <add-menu-item
      type="sauces"
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
  name: "Sauces",
  components: {
    EditIngredientsMenu,
    EditMenuItem,
    AddMenuItem,
    RestaurantHeader
  },
  setup() {
    const sauces = ref([]);
    const error = ref(null);

    const load = async () => {
      try {
        const res = await projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .get();
        var saucesDB = { ...res.data().sauces };

        for (const sauceDB in saucesDB) {
          const sauce = saucesDB[sauceDB];
          sauces.value.push(sauce);
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
      sauces.value[editIndex.value]=newValuesIngredient

        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
          sauces: fieldValue.arrayRemove(menuItemToEdit.value),
        })
       
        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
            sauces: fieldValue.arrayUnion(newValuesIngredient),
        })
    
    }

    const addMenuItemToFirebase = (menuItemToAdd) => {
      sauces.value.push(menuItemToAdd);
      addingMenuItem.value = false;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          sauces: fieldValue.arrayUnion(menuItemToAdd),
        });
    }

    const removeItem = (menuItemToRemove, index) => {
        sauces.value.splice(index, 1);
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            sauces: fieldValue.arrayRemove(menuItemToRemove),
          });
      } 

      const changeAvailability = (sauce, index) => {
        let newAvailibility = !sauce.isAvailable;
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            sauces: fieldValue.arrayRemove(sauce),
          });

        sauces.value[index].isAvailable = newAvailibility;
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            sauces: fieldValue.arrayUnion(sauce),
          });
      }

    load();
    return {
      sauces, editingMenuItem, menuItemToEdit, editIndex, addingMenuItem, editItem, updateDB, changeAvailability, removeItem, addMenuItemToFirebase
    };
  },
};
</script>

<style>

</style>