<template>
  <div>
    <edit-ingredients-menu />
    <button @click="addingMenuItem = true">add</button>
    <add-menu-item
      type="sides"
      v-if="addingMenuItem"
      @cancel="addingMenuItem = false"
      @addToFirebase="addMenuItemToFirebase($event)"
    />
    <div class="menuitemslist" v-for="(side, index) in sides" :key="side.id">
      {{ side.name }} ............ euro: {{ Number.parseFloat(side.price).toFixed(2) }}......
      <img
        class="editicon"
        src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png"
        @click="editItem(side, index)"
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
        @click="removeItem(side, index)"
      />...
      <label style="font-size: 70%"> available: </label>
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

        projectFirestore.collection("ingredients").doc("sides").update({
          sides: fieldValue.arrayRemove(deleteThis),
        })
       
        projectFirestore.collection("ingredients").doc("sides").update({
            sides: fieldValue.arrayUnion(newValues),
        })
    
    this.editingMenuItem = false;
    this.sides[this.editIndex]=newValues
    },
    addMenuItemToFirebase(addthis) {
      this.sides.push(addthis);
      this.addingMenuItem = false;
      console.log(addthis);
      projectFirestore
        .collection("ingredients")
        .doc("sides")
        .update({
          sides: fieldValue.arrayUnion(addthis),
        });
    },
    removeItem(removethis, index) {
        this.sides.splice(index, 1);
        console.log(removethis);
        projectFirestore
          .collection("ingredients")
          .doc("sides")
          .update({
            sides: fieldValue.arrayRemove(removethis),
          });
      },
      changeAvailability(side, index) {
        const changeTo = !side.isAvailable;
        projectFirestore
          .collection("ingredients")
          .doc("sides")
          .update({
            sides: fieldValue.arrayRemove(side),
          });
        this.sides[index].isAvailable = changeTo;
        projectFirestore
          .collection("ingredients")
          .doc("sides")
          .update({
            sides: fieldValue.arrayUnion(side),
          });
      },
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
        var sideItems = { ...res.data().sides };

        for (const sideItem in sideItems) {
          const side = sideItems[sideItem];
          sides.value.push(side);
        }
      } catch (err) {
        error.value = err.message;
        console.log(error.value);
      }
    };

    load();
    return {
      sides
    };
  },
};
</script>

<style scoped>
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