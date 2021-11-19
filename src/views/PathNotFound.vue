<template>
<div class="path-not-found">
  <h2> The page you are looking for does not exist. </h2>
    <router-link :to="{name: 'GuestLogin'}"> <h3>Go to the home page</h3></router-link>
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