<template>
    <div class="backdrop">
        <div class="additem">
      <form @submit.prevent="handleSubmit">
        <h2>Add to {{type}}</h2>
        <button style="margin-bottom:0.5em;" @click="$emit('cancel')"><span class="material-icons">highlight_off</span> Cancel</button>
        <br>
        <div style="float:left;margin-right:20px;">
        <label>Name: </label><br>
        <input v-model="name" type="text" required>
        </div>
        <div style="float:right">
        <label>Price: </label><br>
        € <input v-model="price" type="Number" step="0.01" required>
        </div>
         <div class="submit" >
        <button v-if="!name || !price" class="submitwait"><span class="material-icons">check_circle</span> Save</button>
        <button v-else><span class="material-icons">check_circle</span> Save</button>
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
      this.$emit('addToFirebase', { isAvailable: true, name: this.name, price: Number(Number.parseFloat(this.price).toFixed(2))})
    }
  }
}
</script>

<style>

</style>