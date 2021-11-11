<template>
  <div>
    <edit-ingredients-menu />
    <button @click="addingMenuItem = true">add</button>
    <add-menu-item
      type="sauces"
      v-if="addingMenuItem"
      @cancel="addingMenuItem = false"
      @addToFirebase="addMenuItemToFirebase($event)"
    />
    <div
      class="menuitemslist"
      v-for="(sauce, index) in sauces"
      :key="sauce.id"
    >
      {{ sauce.name }} ............ €{{ Number.parseFloat(sauce.price).toFixed(2) }}......
      <edit-menu-item
        :itemToEdit="menuItemToEdit"
        @save-changes="updateDB($event)"
        v-if="editingMenuItem"
        @cancel="editingMenuItem = false"
      />
      <img
        class="icon"
        src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png"
        @click="editItem(sauce, index)"
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
</template>

<script>
import EditIngredientsMenu from "../../../components/EditIngredientsMenu.vue";
import { fieldValue, projectFirestore } from "../../../firebase/config";
import { ref } from "vue";
import EditMenuItem from "../../../components/EditMenuItem.vue";
import AddMenuItem from "../../../components/AddMenuItem.vue";

export default {
  name: "Sauces",
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
          sauces: fieldValue.arrayRemove(deleteThis),
        })
       
        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
            sauces: fieldValue.arrayUnion(newValues),
        })
    
    this.editingMenuItem = false;
    this.sauces[this.editIndex]=newValues
    },

    addMenuItemToFirebase(addthis) {
      this.sauces.push(addthis);
      this.addingMenuItem = false;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          sauces: fieldValue.arrayUnion(addthis),
        });
    },
    removeItem(removethis, index) {
      this.sauces.splice(index, 1);
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          sauces: fieldValue.arrayRemove(removethis),
        });
    },
    changeAvailability(sauce, index) {
      const changeTo = !sauce.isAvailable;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          sauces: fieldValue.arrayRemove(sauce),
        });
      this.sauces[index].isAvailable = changeTo;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          sauces: fieldValue.arrayUnion(sauce),
        });
    },
  },
  setup() {
    const sauces = ref([]);
    const error = ref(null);

    const load = async () => {
      try {
        const res = await projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .get()

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

    load();
    return {
      sauces
    };
  },
};
</script>

<style>

</style>