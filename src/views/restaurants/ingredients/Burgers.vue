<template>
  <div class="menuedits">
    <edit-ingredients-menu type="Burgers"/>
    <button @click="addingMenuItem = true">add</button>
    <div
      class="menuitemslist"
      v-for="(burger, index) in burgers"
      :key="burger.id"
    >
      {{ burger.name }} burger ............ €{{ Number.parseFloat(burger.price).toFixed(2) }}......
      <img
        class="icon"
        src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png"
        @click="editItem(burger, index)"
      />
      ...
      <img
        class="icon"
        src="http://cdn.onlinewebfonts.com/svg/img_216917.png"
        @click="removeItem(burger, index)"
      />...
      <label style="font-size: 70%"> available: </label>
      <button
        v-if="burger.isAvailable"
        class="available"
        @click="changeAvailability(burger, index)"
      ></button>
      <button
        v-else
        class="unavailable"
        @click="changeAvailability(burger, index)"
      ></button>
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

export default {
  name: "Burgers",
  components: {
    EditIngredientsMenu,
    EditMenuItem,
    AddMenuItem,
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

    } 

    const updateDB = (newValues) => {
      editingMenuItem.value = false;
      burgers.value[editIndex.value]=newValues

        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
          burgerPatty: fieldValue.arrayRemove(menuItemToEdit.value),
        })
       
        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
            burgerPatty: fieldValue.arrayUnion(newValues),
        })
    
    }

    const addMenuItemToFirebase = (addthis) => {
      burgers.value.push(addthis);
      addingMenuItem.value = false;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayUnion(addthis),
        });
    }

    const removeItem = (removethis, index) => {
        burgers.value.splice(index, 1);
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            burgerPatty: fieldValue.arrayRemove(removethis),
          });
      } 

      const changeAvailability = (burger, index) => {
        let changeTo = !burger.isAvailable;
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            burgerPatty: fieldValue.arrayRemove(burger),
          });

        burgers.value[index].isAvailable = changeTo;
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            burgerPatty: fieldValue.arrayUnion(burger),
          });
      }

    load();
    return {
      burgers, editingMenuItem, menuItemToEdit, editIndex, addingMenuItem, editItem, updateDB, changeAvailability, removeItem, addMenuItemToFirebase
    };
  },
};
</script>

<style>


</style>