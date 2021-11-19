<template>
<div class="backdrop">
    <div class="confirmDeleteItem">
        <p>Are you sure you want to delete this item?</p>
        <button @click="$emit('confirmDelete')">Yes</button>
        <button @click="$emit('denyDelete')">No</button>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style>
.confirmDeleteItem{
  width: auto;
  padding: 1em 2.5em;
  border-radius: 1em;
  position:absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: #ffffff;
}

</style>