<template>
    <div class="backdrop">
        <div class="additem">
      <form @submit.prevent="handleSubmit">
        <h2>Add to {{type}}</h2>
        <button @click="$emit('cancel')">Cancel</button>
        <br>
        <label>Name: </label>
        <input v-model="name" type="text" required>
        <label>Price: </label>
        <input v-model="price" type="Number" step="0.01" required>
        <br>
        <div class="submit">
        <button>Confirm</button>
        </div>
      </form>
        </div>
    </div>
</template>

<script>
 
export default {
  components: {  },
  props: { type: String },
  data() {
      return{
          name: "",
          price: null
      }
  },
  methods: {
    handleSubmit(){
      this.$emit('addToFirebase', { isAvailable: true, name: this.name, price: Number.parseFloat(this.price).toFixed(2)})
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
.additem {
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