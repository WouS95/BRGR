<template>
  <div>
    <edit-ingredients-menu />
    <button @click="addingMenuItem = true">add</button>
    <add-menu-item
      type="drinks"
      v-if="addingMenuItem"
      @cancel="addingMenuItem = false"
      @addToFirebase="addMenuItemToFirebase($event)"
    />
    <div class="menuitemslist" v-for="(drink, index) in drinks" :key="drink.id">
      {{ drink.name }} ............ €{{ Number.parseFloat(drink.price).toFixed(2) }}......
      <img
        class="icon"
        src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png"
        @click="editItem(drink, index)"
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
        @click="removeItem(drink, index)"
      />...
      <label style="font-size: 70%"> available: </label>
      <button
        v-if="drink.isAvailable"
        class="available"
        @click="changeAvailability(drink, index)"
      ></button>
      <button
        v-else
        class="unavailable"
        @click="changeAvailability(drink, index)"
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
  name: "Drinks",
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

        projectFirestore.collection("ingredients").doc("drinks").update({
          drinks: fieldValue.arrayRemove(deleteThis),
        })
       
        projectFirestore.collection("ingredients").doc("drinks").update({
            drinks: fieldValue.arrayUnion(newValues),
        })
    
    this.editingMenuItem = false;
    this.drinks[this.editIndex]=newValues
    },

    addMenuItemToFirebase(addthis) {
      this.drinks.push(addthis);
      this.addingMenuItem = false;
      projectFirestore
        .collection("ingredients")
        .doc("drinks")
        .update({
          drinks: fieldValue.arrayUnion(addthis),
        });
    },
    removeItem(removethis, index) {
        this.drinks.splice(index, 1);
        projectFirestore
          .collection("ingredients")
          .doc("drinks")
          .update({
            drinks: fieldValue.arrayRemove(removethis),
          });
      },
      changeAvailability(drink, index) {
        const changeTo = !drink.isAvailable;
        projectFirestore
          .collection("ingredients")
          .doc("drinks")
          .update({
            drinks: fieldValue.arrayRemove(drink),
          });
        this.drinks[index].isAvailable = changeTo;
        projectFirestore
          .collection("ingredients")
          .doc("drinks")
          .update({
            drinks: fieldValue.arrayUnion(drink),
          });
      },
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
    load();
    return {
      drinks,
    };
  },
};
</script>

<style>
.menuitemslist {
  text-align: right;
}

.unavailable {
  background-color: #9c0000;
}
.available {
  background-color: #45be3a;
}
.icon {
  height: 15px;
}
</style>