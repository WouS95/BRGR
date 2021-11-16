<template>
<RestaurantHeader/>
  <div class="menuedits">
    <edit-ingredients-menu type="Sauces"/>
    <button @click="addingMenuItem = true">add</button>
    <div
      class="menuitemslist"
      v-for="(sauce, index) in sauces"
      :key="sauce.id"
    >
      {{ sauce.name }} ............ €{{ Number.parseFloat(sauce.price).toFixed(2) }}......
      <img
        class="icon"
        src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png"
        @click="editItem(sauce, index)"
      />
      ...
      <img
        class="icon"
        src="http://cdn.onlinewebfonts.com/svg/img_216917.png"
        @click="removeItem(sauce, index)"
      />...
      <label style="font-size: 70%"> available: </label>
      <button
        v-if="sauce.isAvailable"
        class="available"
        @click="changeAvailability(sauce, index)"
      ></button>
      <button
        v-else
        class="unavailable"
        @click="changeAvailability(sauce, index)"
      ></button>
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

    const updateDB = (newValues) => {
      editingMenuItem.value = false;
      sauces.value[editIndex.value]=newValues

        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
          sauces: fieldValue.arrayRemove(menuItemToEdit.value),
        })
       
        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
            sauces: fieldValue.arrayUnion(newValues),
        })
    
    }

    const addMenuItemToFirebase = (addthis) => {
      sauces.value.push(addthis);
      addingMenuItem.value = false;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          sauces: fieldValue.arrayUnion(addthis),
        });
    }

    const removeItem = (removethis, index) => {
        sauces.value.splice(index, 1);
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            sauces: fieldValue.arrayRemove(removethis),
          });
      } 

      const changeAvailability = (sauce, index) => {
        let changeTo = !sauce.isAvailable;
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            sauces: fieldValue.arrayRemove(sauce),
          });

        sauces.value[index].isAvailable = changeTo;
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