<template>
<RestaurantHeader/>
  <h1 class="ingredientsHeader">Ingredients</h1>
  <div class="menuedits">
    <edit-ingredients-menu type="Sides"/>
    <button class="add-new-ingredient" @click="addingMenuItem = true"><span class="material-icons">add</span> Add</button>
    <div class="menuitem" v-for="(side, index) in sides" :key="side.id">
      <img v-if="side.image" :src="side.image">
      <span class="menuitem-name">{{ side.name }} </span>
       € {{ Number.parseFloat(side.price).toFixed(2) }}
      <span class="material-icons" @click="editItem(side, index)">edit</span>
      <span class="material-icons" @click="removeItem(side, index)"> delete </span>
      <label class="subtitle"> Available: </label>
      <label class="switch">
        <input
          v-model="side.isAvailable"
          type="checkbox"
          @click="changeAvailability(side, index)"
        />
        <span class="slider round"></span>
      </label>
    </div>
  </div>
  <add-menu-item
    type="sides"
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
  name: "Sides",
  components: {
    EditIngredientsMenu,
    EditMenuItem,
    AddMenuItem,
    RestaurantHeader
  },
  setup() {
    const sides = ref([]);
    const error = ref(null);

    const load = async () => {
      try {
        const res = await projectFirestore
          .collection("ingredients")
          .doc("sides")
          .get();
        var sidesDB = { ...res.data().sides };

        for (const sideDB in sidesDB) {
          const side = sidesDB[sideDB];
          sides.value.push(side);
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
      sides.value[editIndex.value]=newValuesIngredient

        projectFirestore.collection("ingredients").doc("sides").update({
          sides: fieldValue.arrayRemove(menuItemToEdit.value),
        })
       
        projectFirestore.collection("ingredients").doc("sides").update({
            sides: fieldValue.arrayUnion(newValuesIngredient),
        })
    
    }

    const addMenuItemToFirebase = (menuItemToAdd) => {
      sides.value.push(menuItemToAdd);
      addingMenuItem.value = false;
      projectFirestore
        .collection("ingredients")
        .doc("sides")
        .update({
          sides: fieldValue.arrayUnion(menuItemToAdd),
        });
    }

    const removeItem = (menuItemToRemove, index) => {
        sides.value.splice(index, 1);
        projectFirestore
          .collection("ingredients")
          .doc("sides")
          .update({
            sides: fieldValue.arrayRemove(menuItemToRemove),
          });
      } 

      const changeAvailability = (side, index) => {
        let newAvailibility = !side.isAvailable;
        projectFirestore
          .collection("ingredients")
          .doc("sides")
          .update({
            sides: fieldValue.arrayRemove(side),
          });

        sides.value[index].isAvailable = newAvailibility;
        projectFirestore
          .collection("ingredients")
          .doc("sides")
          .update({
            sides: fieldValue.arrayUnion(side),
          });
      }

    load();
    return {
      sides, editingMenuItem, menuItemToEdit, editIndex, addingMenuItem, editItem, updateDB, changeAvailability, removeItem, addMenuItemToFirebase
    };
  },
};
</script>

<style>

</style>