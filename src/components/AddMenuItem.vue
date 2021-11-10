<template>
    <div class="backdrop">
        <div class="additem">
      <form>
        <h2>Add to {{type}}</h2>
        <button @click="$emit('cancel')">Cancel</button>
        <br>
        <label>Name: </label>
        <input v-model="name" type="text" required>
        <label>Price: </label>
        <input v-model="price" type="Number" step="0.01" required>
        <br>
        <button @click="addToFirebase">Confirm</button>
      </form>
        </div>
    </div>
</template>

<script>
import DisplayMenuEdits from './DisplayMenuEdits.vue'
import {projectFirestore} from '../firebase/config' 
export default {
  components: { DisplayMenuEdits },
  props: { type: String },

  data() {
      return{
          name: "",
          price: null
      }
  },
  methods: {
      addToFirebase(){
          let data = { 
            isAvailable: true,
            name: this.name,
            price: this.price,
      }
          console.log("add menu item to the firebase")
        //   var nieuweInhoud = 
        //   projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({drinks: {isAvailable: true,
        //     name: this.name,
        //     price: this.price,}})
        // var updatedDrinks = projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({
        //     drinks: FieldValue.arrayUnion({isAvailable: true,  name: this.name,  price: this.price,})
        // })
        // const drinks = doc()
        
         //projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update('drinks', {isAvailable: true,  name: this.name,  price: this.price,})
       
        // projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').arrayUnion({drinks: {isAvailable: true,
        //     name: this.name,
        //     price: this.price,}})
        //   this.$emit('cancel')
      },
      setToAvailable(){
          projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({'drinks.isAvailable': true} )
      },
      setToUnavailable(){
          projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({'drinks.isAvailable': false} )
      }
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