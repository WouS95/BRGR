<template>
<div>
    <edit-ingredients-menu />
    <button> add </button>
    <div v-for="(sideItem, index) in sideItems" :key="sideItem.id">
        <p> {{sideItem.name}} $ {{sideItem.price}}.00
            <button>edit</button>
            <button>remove</button>
            <label style="font-size: 70%;"> available: </label>
            <button v-if="sideItem.isAvailable" class="available" @click="changeAvailability(sideItem, index)"> O---</button>
            <button v-else class="unavailable" @click="changeAvailability(sideItem, index)">---O</button>
        </p>
    </div>
</div>
</template>

<script>
import {useRouter} from 'vue-router'
import EditIngredientsMenu from '../../../components/EditIngredientsMenu.vue'
import {projectFirestore} from '../../../firebase/config'
import {ref} from 'vue'
export default {
    name: 'Sides',
    components: {
        EditIngredientsMenu
    },
    methods: {
        // changeAvailability(index, changeTo){
        //     console.log("toggle it"+index+" change it to: "+changeTo)
        //     const changeitem = "sides."+index+".isAvailable"
        //      projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({changeitem: changeTo} )

        // },

              setToAvailable(){
          projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({'drinks.isAvailable': true} )
      },
      setToUnavailable(){
          projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({'drinks.isAvailable': false} )
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
            const changeitem = "drinks."+index+".isAvailable"
            if (index===0){
                projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({'sides.0.isAvailable' : changeTo} )
            }
            else if( index ===1){
                projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').update({'sides.1.isAvailable' : changeTo} )
            }
        }

        load()
        return {
            sideItems, changeAvailability
        }
    }

}
</script>

<style>
.available{
    background-color: #9c0000;
}
.unavailable{
    background-color: #ffaeae;
}
</style>