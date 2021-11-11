<template>
  <div>
    <edit-ingredients-menu />
    <button @click="addingMenuItem = true">add</button>
    <add-menu-item
      type="burgers"
      v-if="addingMenuItem"
      @cancel="addingMenuItem = false"
      @addToFirebase="addMenuItemToFirebase($event)"
    />
    <div
      class="menuitemslist"
      v-for="(burger, index) in burgers"
      :key="burger.id"
    >
      {{ burger.name }} burger ............ €{{ Number.parseFloat(burger.price).toFixed(2) }}......
      <edit-menu-item
        :itemToEdit="menuItemToEdit"
        @save-changes="updateDB($event)"
        v-if="editingMenuItem"
        @cancel="editingMenuItem = false"
      />
      <img
        class="icon"
        src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png"
        @click="editItem(burger, index)"
      />
      <edit-menu-item
        v-if="editingMenuItem"
        :itemToEdit="menuItemToEdit"
        @save-changes="updateDB($event)"
        @cancel="editingMenuItem = false"
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
  data() {
    return {
      addingMenuItem: false,
      editingMenuItem: false,
      menuItemToEdit: {},
      editIndex: null,
    };
  },
  methods: {
    editItem(itemToEdit, index) {
      this.editingMenuItem = true;
      this.menuItemToEdit = itemToEdit;
      this.editIndex = index;

    },
    updateDB(newValues) {
        const deleteThis = this.menuItemToEdit
        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
          burgerPatty: fieldValue.arrayRemove(deleteThis),
        })
       
        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
            burgerPatty: fieldValue.arrayUnion(newValues),
        })
    
    this.editingMenuItem = false;
    this.burgers[this.editIndex]=newValues
    },

    addMenuItemToFirebase(addthis) {
      this.burgers.push(addthis);
      this.addingMenuItem = false;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayUnion(addthis),
        });
    },
    removeItem(removethis, index) {
      this.burgers.splice(index, 1);
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayRemove(removethis),
        });
    },
    changeAvailability(burger, index) {
      const changeTo = !burger.isAvailable;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayRemove(burger),
        });
      this.burgers[index].isAvailable = changeTo;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          burgerPatty: fieldValue.arrayUnion(burger),
        });
    },
  },
  setup() {
    const burgers = ref([]);
    const error = ref(null);

    const load = async () => {
      try {
        const res = await projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .get()

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

    load();
    return {
      burgers
    };
  },
};
</script>

<style>


</style>