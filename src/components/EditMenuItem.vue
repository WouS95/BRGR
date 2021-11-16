<template>
    <div class="backdrop">
        <div class="edititem">
      <form @submit.prevent="handleSubmit">
        <h2>Edit {{itemToEdit.name}}</h2>
        <button style="margin-bottom:0.5em;" @click="$emit('cancel')"><span class="material-icons">highlight_off</span> Cancel</button>
        <br>
        <div style="float:left;margin-right:20px;">
        <label>Name: </label><br>
        <input v-model="name" type="text" required>
        </div>
        <div style="float:right">
        <label>Price: </label><br>
        €<input v-model="price" type="Number" step="0.01" required>
        </div>
        <div class="submit">
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

<style>

</style>