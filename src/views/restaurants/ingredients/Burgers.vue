<template>
<div>
    <edit-ingredients-menu />
    <button @click="newBurger"> add </button>

</div>
</template>

<script>
import EditIngredientsMenu from '../../../components/EditIngredientsMenu.vue'
export default {
    name: 'Burgers',
    components: {
        EditIngredientsMenu
        
    },

}
</script>

<style>

</style>