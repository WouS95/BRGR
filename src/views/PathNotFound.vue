<template>
<div class="path-not-found">
  <h2> The page you are looking for does not exist. </h2>
    <h3><router-link :to="{name: 'GuestLogin'}">Direct home</router-link></h3>
</div>
</template>

<script>
export default {

}
</script>

<style>
.path-not-found{
    text-align: center;
    color: white;
    text-decoration: none;
}
</style>