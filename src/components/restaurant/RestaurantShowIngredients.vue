<template>
    <button class="add-new-ingredient" @click="addingMenuItem = true">
      <span class="material-icons">add</span> Add
    </button>
    <div class="menuitem" v-for="(ingredient, index) in ingredientList" :key="ingredient.id">
      <img v-if="ingredient.image" :src="ingredient.image">
      <span class="menuitem-name"> {{ ingredient.name }} </span>
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
    :type="ingredientType"
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
           documentName: String
             },
  components: {
    EditMenuItem,
    AddMenuItem,
  },
  setup(props) {
    const ingredientList = ref([]);
    const error = ref(null);

//   // register the firestore collection reference
//   let collectionRef = projectFirestore.collection('ingredients').doc(props.documentName)

//   collectionRef.onSnapshot(snap => {
//     let results = [];
//     snap.docs.forEach(doc => {
//       // must wait for the server to create the timestamp & send it back
//       // we don't want to edit data until it has done this
//       doc.data() && results.push({
//         ...doc.data(),
//         id: doc.id
//       })
//     });

//     // update values
//     for( var i =0; i<results.length; i++){
//         if (props.documentName === results[i].id){
//              console.log(results[i])
           
//         }
//     }
//     ingredientList.value = results;
//     // console.log(orders.value)
//     error.value = null;
//   }, err => {
//     console.log(err.message)
//     ingredientList.value = null
//     error.value = 'could not fetch the data'
//   })

    const loadIngredientList = async () => {
        try {
            const res = await projectFirestore
          .collection("ingredients")
          .doc(props.documentName)
          .get();
        if (props.ingredientType == "burgerPatty"){
            var ingredientsFromDB = { ...res.data().burgerPatty};
        }
        else if (props.ingredientType == "breads"){
            var ingredientsFromDB = { ...res.data().breads};
        }
        else if (props.ingredientType == "sauces"){
            var ingredientsFromDB = { ...res.data().sauces};
        }
        else if (props.ingredientType == "toppings"){
            var ingredientsFromDB = { ...res.data().toppings};
        }
        else if (props.ingredientType == "drinks"){
            var ingredientsFromDB = { ...res.data().drinks};
        }
        else if (props.ingredientType == "sides"){
            var ingredientsFromDB = { ...res.data().sides};
        }

        for (const ingredientFromDB in ingredientsFromDB) {
          const ingredient = ingredientsFromDB[ingredientFromDB];
          ingredientList.value.push(ingredient);
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
    loadIngredientList()

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