<template>
<div>
    <edit-ingredients-menu />
    <button> add </button>
    <ul v-for="sideItem in sideItems" :key="sideItem.id">
        <li> {{sideItem.name}}
            <button>edit</button>
            <button>remove</button>
            <button class="slideButton" @click="toggleAvailability">available?</button>
        </li>
    </ul>
</div>
</template>

<script>
import EditIngredientsMenu from '../../../components/EditIngredientsMenu.vue'
import {projectFirestore} from '../../../firebase/config'
import {ref} from 'vue'
export default {
    name: 'Sides',
    components: {
        EditIngredientsMenu
    },
    setup(){
        const sideItems = ref([])
        const error = ref(null)
        
        const load = async () => {
            try{
                const res = await projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').get()
                // sideItems.value = res.data('drinks')
                var sides = {...res.data().sides}
                
                // console.log(sides)

                // sides.forEach(element => {
                //     console.log(element)
                // });
                // for (var i = 0; i < sides.length ; i++){
                //     console.log(sides[i])
                //     console.log('he')
                // }
                
                // for (side in sides){
                //     console.log(x)
                // }
                for (const side in sides) {
                    // console.log(sides[side])
                    const sideItem = sides[side]
                    // sideItems.value = {sideItem}
                    console.log(sideItem)
                    sideItems.value.push(sideItem)
                    // if (Object.hasOwnProperty.call(sides, key)) {
                    //     const element = sides[key];
                    //     console.log(sides[key])
                        
                    // }
                }


                //  sideItems.value = {sides}
                
                // console.log(res)

            } catch(err){
                error.value = err.message
                console.log(error.value)
            }
        }
                console.log(sideItems)
        load()
        return {
            sideItems
        }
    }

}
</script>

<style>

</style>