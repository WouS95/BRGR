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
        € <input v-model="price" type="Number" step="0.01" required>
        </div>
        <div>
        <label> Upload image (optional)</label><br>
        <input @change="setImg" type="file" accept="image/*" >
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
 import firebase from 'firebase/compat/app'
 import 'firebase/compat/storage'
export default {
  components: {  },
  props: { itemToEdit: Object},
  data(){
    return{
      availability: this.itemToEdit.isAvailable,
      name: this.itemToEdit.name,
      price: this.itemToEdit.price,
      imageFile: this.itemToEdit.image,
      newImg: false
    }
  },
  methods: {
    handleSubmit(){
      if (this.imageFile && this.newImg){
        const storageRef=firebase.storage().ref(`${this.imageFile.name}`).put(this.imageFile);
        storageRef.on(`state_changed`,snapshot=>{
        this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          }, error=>{console.log(error.message)},
        ()=>{this.uploadValue=100;
            storageRef.snapshot.ref.getDownloadURL().then((url)=>{
              this.$emit('save-changes', { isAvailable: this.availability, name: this.name, price: Number(Number.parseFloat(this.price).toFixed(2)), image: url})
              });
            }      
          );
      }
      else if(this.imageFile && !this.newImg){
        this.$emit('save-changes', { isAvailable: this.availability, name: this.name, price: Number(Number.parseFloat(this.price).toFixed(2)), image: this.itemToEdit.image})
      }
      else{
        this.$emit('save-changes', { isAvailable: this.availability, name: this.name, price: Number(Number.parseFloat(this.price).toFixed(2))})
      }
    },
    setImg(e){
      this.imageFile = e.target.files[0]
      this.newImg = true
    }
  }

}
</script>

<style>

</style>