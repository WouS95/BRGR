<template>
    <div class="backdrop">
        <div class="edititem">
      <form>
          {{itemToEdit}}
        <h2>Edit {{itemToEdit.name}}</h2>
        <button @click="$emit('cancel')">Cancel</button>
        <br>
        <label>Name: </label>
        <input v-model="itemToEdit.name" type="text" required>
        <label>Price: </label>
        <input v-model="itemToEdit.price" type="Number" step="0.01" required>
        <br>
        <button @click="editItem">save</button>
      </form>
        </div>
    </div>
</template>

<script>
import DisplayMenuEdits from './DisplayMenuEdits.vue'
// import {projectFirestore} from '../firebase/config' 
export default {
  components: { DisplayMenuEdits },
  props: { itemToEdit: Object},
   emits: ['save-changes'],
    methods: {
      editItem(){
        //   const editedItem = this.itemToEdit
        //   console.log(editedItem)
        //   alert(this.itemToEdit)
          this.$emit('save-changes', [this.itemToEdit])
      },
  }

}
</script>

<style>
/* https://www.codegrepper.com/code-examples/css/input+type+number+hide+arrows */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { 
	-webkit-appearance: none;
}
input[type=number]{
    width: 25px;
}
.edititem {
  position: fixed;
  top: 35%;
  left: 35%;
  margin: 10px auto ;
  padding: 15px ;
  width: 30%;
  border-radius: 10px;
  text-align: center;
  background: #ffffff;
  color: black;
}

  .backdrop{
      top: 0;
      position: fixed;
      background: rgba(0,0,0,0.5);
      width: 100%;
      height: 100%;
  }
</style>