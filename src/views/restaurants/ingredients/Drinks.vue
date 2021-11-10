<template>
<div>
    <edit-ingredients-menu />
    <button @click="addingMenuItem=true"> add </button>
    <add-menu-item v-if="addingMenuItem" type="drink" @cancel="addingMenuItem=false" />
    <ul v-for="menuItem in menuItems" :key="menuItem.key">
        <li> menuItem - price
            <button>edit</button>
            <button>remove</button>
            <button class="slideButton" @click="toggleAvailability">available?</button>
        </li>
    </ul>

</div>
</template>

<script>
import AddMenuItem from '../../../components/AddMenuItem.vue'
import EditIngredientsMenu from '../../../components/EditIngredientsMenu.vue'
import {projectFirestore} from '../../../firebase/config'
export default {
    name: 'Drinks',
    components: {
        EditIngredientsMenu,
        AddMenuItem
    },
    data() {
        return{
            addingMenuItem: false,
            menuItems: ["iets", "anders"]
        }
    },
    mounted() {
        let menuList = []
        const load = async () => {
            const res = await projectFirestore.collection('ingredients').doc('3EBiUmdwrZxSBPrIcUyc').get()
            for (var i = 0; i<res.data().drinks.length; i++){
                console.log(res.data().drinks[i])
                menuList.push(res.data().drinks[i])
            }
        }
        load()
}

}
</script>

<style>

</style>