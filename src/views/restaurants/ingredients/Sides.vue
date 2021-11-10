<template>
<div>
    <edit-ingredients-menu />
    <button @click="addingMenuItem=true"> add </button>
    <add-menu-item type="sides" v-if="addingMenuItem" @cancel="addingMenuItem=false"/>
    <div v-for="(sideItem, index) in sideItems" :key="sideItem.id">
        {{sideItem.name}} &#9; euro: {{sideItem.price}}
            <!-- add icon to click -->
            <edit-menu-item :itemToEdit="menuItemToEdit" @save-changes="updateDB($event)" v-if="editingMenuItem" @cancel="editingMenuItem=false"/>
            <button @click="editItem(sideItem, index)" >edit </button>
            <!-- add icon to click -->
            <button @click="removeItem">remove</button>
            <label style="font-size: 70%;"> available: </label>
            <button v-if="sideItem.isAvailable" class="available" @click="changeAvailability(sideItem, index)"> </button>
            <button v-else class="unavailable" @click="changeAvailability(sideItem, index)"></button>
        
    </div>
</div>
</template>

<script>
import EditIngredientsMenu from '../../../components/EditIngredientsMenu.vue'
import {projectFirestore} from '../../../firebase/config'
import {ref} from 'vue'
import EditMenuItem from '../../../components/EditMenuItem.vue'
import AddMenuItem from '../../../components/AddMenuItem.vue'

export default {
    name: 'Sides',
    components: {
        EditIngredientsMenu,
        EditMenuItem,
        AddMenuItem
    },
    data(){
        return {
            addingMenuItem: false,
            editingMenuItem: false,
            menuItemToEdit: {},
            editIndex: null
        }
    },
    methods:{
        editItem(itemToEdit, index){
            this.editingMenuItem=true
            this.menuItemToEdit = itemToEdit
            this.editIndex = index
        },
        updateDB(newValues){
            this.editingMenuItem=false
            console.log(newValues, this.editIndex)
            var updateTekst = 'sides.'+this.editIndex
            console.log(updateTekst)
            projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({[updateTekst] : newValues} )
        }
    },
    setup(){
        const sideItems = ref([])
        const error = ref(null)
        
        const load = async () => {
            try{
                const res = await projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').get()
                var sides = {...res.data().sides}
                                
                for (const side in sides) {
                    const sideItem = sides[side]
                    console.log(sideItem)
                    sideItems.value.push(sideItem)
                }

            } catch(err){
                error.value = err.message
                console.log(error.value)
            }
        }

        const changeAvailability = (side, index) => {
            console.log("currently: "+ side.isAvailable)
            const changeTo = !side.isAvailable
            console.log(changeTo)
            var changeitem = "sides."+index+".isAvailable"
            projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({[changeitem] : changeTo} )
            sideItems.value[index].isAvailable = changeTo
        }

        // const editItem = (itemToEdit) => {
        //     this.data.editingMenuItem=true
        //     console.log("edit the item")
        //     console.log(itemToEdit)
        // }

        const removeItem = () => {
            console.log("remove the item")
        }
    

        load()
        return {
            sideItems, changeAvailability, removeItem
        }
    }

}
</script>

<style scoped>
button{
    background-color: white;
    color: black;
}
.unavailable{
    background-color: #9c0000;
}
.available{
    background-color: #45be3a;
}


</style>