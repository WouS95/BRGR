<template>
  <div>
    <edit-ingredients-menu />
    <button @click="addingMenuItem = true">add</button>
    <add-menu-item
      type="toppings"
      v-if="addingMenuItem"
      @cancel="addingMenuItem = false"
      @addToFirebase="addMenuItemToFirebase($event)"
    />
    <div
      class="menuitemslist"
      v-for="(topping, index) in toppings"
      :key="topping.id"
    >
      {{ topping.name }} ............ euro: {{ Number.parseFloat(topping.price).toFixed(2) }}......
      <edit-menu-item
        :itemToEdit="menuItemToEdit"
        @save-changes="updateDB($event)"
        v-if="editingMenuItem"
        @cancel="editingMenuItem = false"
      />
      <img
        class="editicon"
        src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png"
        @click="editItem(topping, index)"
      />
      <edit-menu-item
        v-if="editingMenuItem"
        :itemToEdit="menuItemToEdit"
        @save-changes="updateDB($event)"
        @cancel="editingMenuItem = false"
      />
      ...
      <img
        class="trashcan"
        src="http://cdn.onlinewebfonts.com/svg/img_216917.png"
        @click="removeItem(topping, index)"
      />...
      <label style="font-size: 70%"> available: </label>
      <button
        v-if="topping.isAvailable"
        class="available"
        @click="changeAvailability(topping, index)"
      ></button>
      <button
        v-else
        class="unavailable"
        @click="changeAvailability(topping, index)"
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
  name: "Toppings",
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
        console.log(newValues)

        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
          toppings: fieldValue.arrayRemove(deleteThis),
        })
       
        projectFirestore.collection("ingredients").doc("burgerIngredients").update({
            toppings: fieldValue.arrayUnion(newValues),
        })
    
    this.editingMenuItem = false;
    this.toppings[this.editIndex]=newValues
    },

    addMenuItemToFirebase(addthis) {
      this.toppings.push(addthis);
      this.addingMenuItem = false;
      console.log(addthis);
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          toppings: fieldValue.arrayUnion(addthis),
        });
    },
    removeItem(removethis, index) {
      this.toppings.splice(index, 1);
      console.log(removethis);
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          toppings: fieldValue.arrayRemove(removethis),
        });
    },
    changeAvailability(topping, index) {
      const changeTo = !topping.isAvailable;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          toppings: fieldValue.arrayRemove(topping),
        });
      this.toppings[index].isAvailable = changeTo;
      projectFirestore
        .collection("ingredients")
        .doc("burgerIngredients")
        .update({
          toppings: fieldValue.arrayUnion(topping),
        });
    },
  },
  setup() {
    const toppings = ref([]);
    const error = ref(null);

    const load = async () => {
      try {
        const res = await projectFirestore
          .collection("ingredients")
          .doc("burgerIngredients")
          .get()

        var toppingsDB = { ...res.data().toppings };

        for (const toppingDB in toppingsDB) {
          const topping = toppingsDB[toppingDB];
          console.log(topping);
          toppings.value.push(topping);
        }
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
    };

    load();
    return {
      toppings
    };
  },
};
</script>

<style>
.menuitemslist {
  width: 70%;
  text-align: right;
}
button {
  background-color: white;
  color: black;
}
.unavailable {
  background-color: #9c0000;
}
.available {
  background-color: #45be3a;
}
.trashcan {
  height: 15px;
}

.editicon {
  height: 15px;
}
</style>