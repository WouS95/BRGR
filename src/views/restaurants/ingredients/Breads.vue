<template>
  <RestaurantHeader/>
  <div class="menuedits">
    <edit-ingredients-menu type="Breads"/>
    <button @click="addingMenuItem = true">add</button>
    <div
      class="menuitemslist"
      v-for="(bread, index) in breads"
      :key="bread.id"
    >
      {{ bread.name }} bun ............ €{{ Number.parseFloat(bread.price).toFixed(2) }}......

      <img
        class="icon"
        src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png"
        @click="editItem(bread, index)"
      />
      ...
      <img
        class="icon"
        src="http://cdn.onlinewebfonts.com/svg/img_216917.png"
        @click="removeItem(bread, index)"
      />...
      <label style="font-size: 70%"> available: </label>
      <button
        v-if="bread.isAvailable"
        class="available"
        @click="changeAvailability(bread, index)"
      ></button>
      <button
        v-else
        class="unavailable"
        @click="changeAvailability(bread, index)"
      ></button>
    </div>
  </div>
  <add-menu-item
    type="breads"
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
  name: "Breads",
  components: {
    EditIngredientsMenu,
    EditMenuItem,
    AddMenuItem,
    RestaurantHeader
  },
  setup() {
    const breads = ref([]);
    const error = ref(null);

    const load = async () => {
      try {
        const res = await projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .get();
        var breadsDB = { ...res.data().breads };

        for (const breadDB in breadsDB) {
          const bread = breadsDB[breadDB];
          breads.value.push(bread);
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
      breads.value[editIndex.value]=newValues

        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
          breads: fieldValue.arrayRemove(menuItemToEdit.value),
        })
       
        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
            breads: fieldValue.arrayUnion(newValues),
        })
    
    }

    const addMenuItemToFirebase = (addthis) => {
      breads.value.push(addthis);
      addingMenuItem.value = false;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          breads: fieldValue.arrayUnion(addthis),
        });
    }

    const removeItem = (removethis, index) => {
        breads.value.splice(index, 1);
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            breads: fieldValue.arrayRemove(removethis),
          });
      } 

      const changeAvailability = (bread, index) => {
        let changeTo = !bread.isAvailable;
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            breads: fieldValue.arrayRemove(bread),
          });

        breads.value[index].isAvailable = changeTo;
        projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .update({
            breads: fieldValue.arrayUnion(bread),
          });
      }

    load();
    return {
      breads, editingMenuItem, menuItemToEdit, editIndex, addingMenuItem, editItem, updateDB, changeAvailability, removeItem, addMenuItemToFirebase
    };
  },
};
</script>

<style>

</style>