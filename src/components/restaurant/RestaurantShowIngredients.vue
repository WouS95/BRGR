<template>
    <button class="add-new-ingredient" @click="addingMenuItem = true">
      <span class="material-icons">add</span> Add
    </button>
    <div class="menuitem" v-for="(ingredient, index) in ingredientList" :key="ingredient.id">
      <img v-if="ingredient.image" :src="ingredient.image">
      <span class="menuitem-name"> {{ ingredient.name }} {{addition}} </span>
       € {{ Number.parseFloat(ingredient.price).toFixed(2) }}
      <span class="material-icons" @click="editItem(ingredient, index)">edit</span>
      <span class="material-icons" @click="removeItem(ingredient, index)">delete</span>
      <label class="subtitle"> Available: </label>
      <label class="switch">
        <input
          v-model="ingredient.isAvailable"
          type="checkbox"
          @click="changeAvailability(ingredient, index)"
        />
        <span class="slider round"></span>
      </label>
    </div>
  <add-menu-item
    :type="nameIngredient"
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
import { fieldValue, projectFirestore } from "../../firebase/config";
import { ref } from "vue";
import EditMenuItem from "../../components/EditMenuItem.vue";
import AddMenuItem from "../../components/AddMenuItem.vue";

export default {
  name: "ShowIngredients",
  props: { ingredientType: String,
           documentName: String,
           ingredientList: Array
             },
  components: {
    EditMenuItem,
    AddMenuItem,
  },
  computed: {
      nameIngredient: function(){
          if (this.ingredientType === "burgerPatty"){
              return "burgers"
          }
          else if (this.ingredientType === "sides"){
              return "side items"
          }
          else{
              return this.ingredientType
          }
      },
      addition: function(){
          if (this.ingredientType === "burgerPatty"){
              return "burger"
          }
          else if (this.ingredientType === "breads"){
              return "bread"
          }
      }
  },
  setup(props) {
    const ingredientList = ref([]);
    ingredientList.value = props.ingredientList

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
      ingredientList.value[editIndex.value] = newValuesIngredient;

      projectFirestore
        .collection("ingredients")
        .doc(props.documentName)
        .update({
          [props.ingredientType]: fieldValue.arrayRemove(menuItemToEdit.value),
        });

      projectFirestore
        .collection("ingredients")
        .doc(props.documentName)
        .update({
          [props.ingredientType]: fieldValue.arrayUnion(newValuesIngredient),
        });
    };

    const addMenuItemToFirebase = (menuItemToAdd) => {
      ingredientList.value.push(menuItemToAdd);
      addingMenuItem.value = false;
      projectFirestore
        .collection("ingredients")
        .doc(props.documentName)
        .update({
          [props.ingredientType]: fieldValue.arrayUnion(menuItemToAdd),
        });
    };

    const removeItem = (menuItemToRemove, index) => {
      ingredientList.value.splice(index, 1);
      projectFirestore
        .collection("ingredients")
        .doc(props.documentName)
        .update({
          [props.ingredientType]: fieldValue.arrayRemove(menuItemToRemove),
        });
    };

    const changeAvailability = (ingredient, index) => {
      let newAvailibility = !ingredient.isAvailable;
      projectFirestore
        .collection("ingredients")
        .doc(props.documentName)
        .update({
          [props.ingredientType]: fieldValue.arrayRemove(ingredient),
        });

      ingredientList.value[index].isAvailable = newAvailibility;
      projectFirestore
        .collection("ingredients")
        .doc(props.documentName)
        .update({
          [props.ingredientType]: fieldValue.arrayUnion(ingredient),
        });
    };
    // loadIngredientList()

    return {
      ingredientList,
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
  }
};
</script>

<style>

</style>