<template>
  <div class="menuedits">
    <edit-ingredients-menu type="Sides"/>
    <button @click="addingMenuItem = true"><span class="material-icons">add</span> Add</button>
    <div class="menuitemslist" v-for="(side, index) in sides" :key="side.id">
      {{ side.name }} ............ €{{ Number.parseFloat(side.price).toFixed(2) }}

      <span class="material-icons" @click="editItem(side, index)">edit</span>
      <span class="material-icons" @click="removeItem(side, index)"> delete </span>
      <label class="subtitle"> Available: </label>
      
      <button
        v-if="side.isAvailable"
        class="available"
        @click="changeAvailability(side, index)"
      ></button>
      <button
        v-else
        class="unavailable"
        @click="changeAvailability(side, index)"
      ></button>
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

export default {
  name: "Sides",
  components: {
    EditIngredientsMenu,
    EditMenuItem,
    AddMenuItem,
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

    const updateDB = (newValues) => {
      editingMenuItem.value = false;
      sides.value[editIndex.value]=newValues

        projectFirestore.collection("ingredients").doc("sides").update({
          sides: fieldValue.arrayRemove(menuItemToEdit.value),
        })
       
        projectFirestore.collection("ingredients").doc("sides").update({
            sides: fieldValue.arrayUnion(newValues),
        })
    
    }

    const addMenuItemToFirebase = (addthis) => {
      sides.value.push(addthis);
      addingMenuItem.value = false;
      projectFirestore
        .collection("ingredients")
        .doc("sides")
        .update({
          sides: fieldValue.arrayUnion(addthis),
        });
    }

    const removeItem = (removethis, index) => {
        sides.value.splice(index, 1);
        projectFirestore
          .collection("ingredients")
          .doc("sides")
          .update({
            sides: fieldValue.arrayRemove(removethis),
          });
      } 

      const changeAvailability = (side, index) => {
        let changeTo = !side.isAvailable;
        projectFirestore
          .collection("ingredients")
          .doc("sides")
          .update({
            sides: fieldValue.arrayRemove(side),
          });

        sides.value[index].isAvailable = changeTo;
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