<template>
  <div class="menuedits">
    <edit-ingredients-menu type="Breads"/>
    <button @click="addingMenuItem = true"><span class="material-icons">add</span> Add</button>
    <div class="menuitem" v-for="(bread, index) in breads" :key="bread.id">
      <span class="menuitem-name"> {{ bread.name }} bun </span>
       €{{ Number.parseFloat(bread.price).toFixed(2) }}
      <span class="material-icons" @click="editItem(bread, index)">edit</span>
      <span class="material-icons" @click="removeItem(bread, index)"> delete </span>
      <label class="subtitle"> Available: </label>
      <label class="switch">
        <input
          v-model="bread.isAvailable"
          type="checkbox"
          @click="changeAvailability(bread, index)"
        />
        <span class="slider round"></span>
      </label>
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

export default {
  name: "Breads",
  components: {
    EditIngredientsMenu,
    EditMenuItem,
    AddMenuItem,
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