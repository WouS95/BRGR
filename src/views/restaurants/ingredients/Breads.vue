<template>
  <div>
    <edit-ingredients-menu />
    <button @click="addingMenuItem = true">add</button>
    <add-menu-item
      type="breads"
      v-if="addingMenuItem"
      @cancel="addingMenuItem = false"
      @addToFirebase="addMenuItemToFirebase($event)"
    />
    <div
      class="menuitemslist"
      v-for="(bread, index) in breads"
      :key="bread.id"
    >
      {{ bread.name }} bun ............ €{{ Number.parseFloat(bread.price).toFixed(2) }}......
      <edit-menu-item
        :itemToEdit="menuItemToEdit"
        @save-changes="updateDB($event)"
        v-if="editingMenuItem"
        @cancel="editingMenuItem = false"
      />
      <img
        class="icon"
        src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png"
        @click="editItem(bread, index)"
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
          breads: fieldValue.arrayRemove(deleteThis),
        })
       
        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
            breads: fieldValue.arrayUnion(newValues),
        })
    
    this.editingMenuItem = false;
    this.breads[this.editIndex]=newValues
    },

    addMenuItemToFirebase(addthis) {
      this.breads.push(addthis);
      this.addingMenuItem = false;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          breads: fieldValue.arrayUnion(addthis),
        });
    },
    removeItem(removethis, index) {
      this.breads.splice(index, 1);
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          breads: fieldValue.arrayRemove(removethis),
        });
    },
    changeAvailability(bread, index) {
      const changeTo = !bread.isAvailable;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          breads: fieldValue.arrayRemove(bread),
        });
      this.breads[index].isAvailable = changeTo;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          breads: fieldValue.arrayUnion(bread),
        });
    },
  },
  setup() {
    const breads = ref([]);
    const error = ref(null);

    const load = async () => {
      try {
        const res = await projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .get()

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

    load();
    return {
      breads
    };
  },
};
</script>

<style>

</style>