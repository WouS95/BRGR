<template>
    <div class="backdrop">
        <div class="edititem">
      <form @submit.prevent="handleSubmit">
        <h2>Edit {{itemToEdit.name}}</h2>
        <button @click="$emit('cancel')">Cancel</button>
        <br>
        <label>Name: </label>
        <input v-model="name" type="text" required>
        <label>Price: </label>
        <input v-model="price" type="Number" step="0.01" required>
        <br>
        <div class="submit">
        <button>save</button>
        </div>
      </form>
        </div>
    </div>
</template>

<script>
export default {
  components: {  },
  props: { itemToEdit: Object},
  data(){
    return{
      availability: this.itemToEdit.isAvailable,
      name: this.itemToEdit.name,
      price: this.itemToEdit.price

    }
  },
  methods: {
    handleSubmit(){
      this.$emit('save-changes', {name: this.name, price: Number(Number.parseFloat(this.price).toFixed(2)), isAvailable: this.availability})
    }
  }

}
</script>

<style scoped>
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