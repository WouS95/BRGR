<template>
<RestaurantHeader/>
  <div class="menuedits">
    <edit-ingredients-menu type="Drinks"/>
    <button style="margin-bottom:0.5em;" @click="addingMenuItem = true"><span class="material-icons">add</span> Add</button>
    <div class="menuitem" v-for="(drink, index) in drinks" :key="drink.id">
      <span class="menuitem-name"> {{ drink.name }} </span>
       € {{ Number.parseFloat(drink.price).toFixed(2) }}
      <span class="material-icons" @click="editItem(drink, index)">edit</span>
      <span class="material-icons" @click="removeItem(drink, index)"> delete </span>
      <label class="subtitle"> Available: </label>
      <label class="switch">
        <input
          v-model="drink.isAvailable"
          type="checkbox"
          @click="changeAvailability(drink, index)"
        />
        <span class="slider round"></span>
      </label>
    </div>
  </div>
  <add-menu-item
    type="drinks"
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
  name: "Drinks",
  components: {
    EditIngredientsMenu,
    EditMenuItem,
    AddMenuItem,
    RestaurantHeader
  },
  
  setup() {
    const drinks = ref([]);
    const error = ref(null);

    const load = async () => {
      try {
        const res = await projectFirestore
          .collection("ingredients")
          .doc("drinks")
          .get();
        var drinksDB = { ...res.data().drinks };

        for (const drinkDB in drinksDB) {
          const drink = drinksDB[drinkDB];
          drinks.value.push(drink);
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

    const updateDB = (newValues) => {
      editingMenuItem.value = false;
      drinks.value[editIndex.value]=newValues

        projectFirestore.collection("ingredients").doc("drinks").update({
          drinks: fieldValue.arrayRemove(menuItemToEdit.value),
        })
       
        projectFirestore.collection("ingredients").doc("drinks").update({
            drinks: fieldValue.arrayUnion(newValues),
        })
    
    }

    const addMenuItemToFirebase = (addthis) => {
      drinks.value.push(addthis);
      addingMenuItem.value = false;
      projectFirestore
        .collection("ingredients")
        .doc("drinks")
        .update({
          drinks: fieldValue.arrayUnion(addthis),
        });
    }

    const removeItem = (removethis, index) => {
        drinks.value.splice(index, 1);
        projectFirestore
          .collection("ingredients")
          .doc("drinks")
          .update({
            drinks: fieldValue.arrayRemove(removethis),
          });
      } 

      const changeAvailability = (drink, index) => {
        let changeTo = !drink.isAvailable;
        projectFirestore
          .collection("ingredients")
          .doc("drinks")
          .update({
            drinks: fieldValue.arrayRemove(drink),
          });

        drinks.value[index].isAvailable = changeTo;
        projectFirestore
          .collection("ingredients")
          .doc("drinks")
          .update({
            drinks: fieldValue.arrayUnion(drink),
          });
      }

    load();
    return {
      drinks, editingMenuItem, menuItemToEdit, editIndex, addingMenuItem, editItem, updateDB, changeAvailability, removeItem, addMenuItemToFirebase
    };
  },
};
</script>

<style>

</style>