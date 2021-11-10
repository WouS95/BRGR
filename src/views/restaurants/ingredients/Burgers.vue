<template>
<div>
    <div>
        <edit-ingredients-menu />
    <button @click="addingMenuItem=true"> add </button>
    <add-menu-item type="drinks" v-if="addingMenuItem" @cancel="addingMenuItem=false"/>
    <div v-for="(drink, index) in drinks" :key="drink.id">
        {{drink.name}} &#9; euro: {{drink.price}}
            <!-- add icon to click -->
            <edit-menu-item :itemToEdit="menuItemToEdit" @save-changes="updateDB($event)" v-if="editingMenuItem" @cancel="editingMenuItem=false"/>
            <button @click="editItem(drink, index)" >edit </button>
            <!-- add icon to click -->
            <button @click="removeItem">remove</button>
            <label style="font-size: 70%;"> available: </label>
            <button v-if="drink.isAvailable" class="available" @click="changeAvailability(drink, index)"> </button>
            <button v-else class="unavailable" @click="changeAvailability(drink, index)"></button>
        
    </div>
    </div>
</div>
</template>

<script>
import EditIngredientsMenu from '../../../components/EditIngredientsMenu.vue'
import {fieldValue, projectFirestore} from '../../../firebase/config'
import {ref} from 'vue'
import EditMenuItem from '../../../components/EditMenuItem.vue'
import AddMenuItem from '../../../components/AddMenuItem.vue'
export default {
    name: 'Burgers',
    components: {
        EditIngredientsMenu,
        EditMenuItem,
        AddMenuItem        
    },
    data() {
        return{
            addingMenuItem: false,
            editingMenuItem: false,
            menuItemToEdit: {},
            editIndex: null
        }
    },
    methods: {
        editItem(itemToEdit, index){
            this.editingMenuItem=true
            this.menuItemToEdit = itemToEdit
            this.editIndex = index
        },
        updateDB(newValues){
            // console.log(newValues, this.editIndex)
            var updateTekst = 'drinks'
            console.log(updateTekst)
            projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({
                drinks : (newValues)
                // [updateTekst] : newValues
            })
            alert("...")
            this.editingMenuItem=false

            // projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({
            // [this.type]: fieldValue.arrayUnion({isAvailable: true,
            // name: this.name,
            // price: this.price})
        }
    },
    setup(){
        const drinks = ref([])
        const error = ref(null)
        
        const load = async () => {
            try{

                // const q = query(citiesRef, where("capital", "==", true));
                const res = await projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').get()
                var drinksDB = {...res.data().burgerIngredients}
                                
                for (const drinkDB in drinksDB) {
                    const drink = drinksDB[drinkDB]
                    console.log(drink)
                    drinks.value.push(drink)
                }

            } catch(err){
                error.value = err.message
                console.log(error.value)
            }
        }

        const changeAvailability = (drink, index) => {
            const changeTo = !drink.isAvailable
           
            var changeitem = "drinks."+index+".isAvailable"
            console.log(projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc'))
            projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({[changeitem] : changeTo} )
            console.log(changeitem)
            drinks.value[index].isAvailable = changeTo
        }

        const removeItem = () => {
            console.log("remove the item")
        }
    
        load()
        return {
            drinks, changeAvailability, removeItem
        }
    }

}
</script>





<style>

</style>
