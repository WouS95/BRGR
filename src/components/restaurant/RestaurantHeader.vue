<template>
    <header class="restaurantHeader">
        <img src="../../assets/img/brgr-logo-black.svg">
        <router-link :to="{name: 'RestaurantOrders'}">Orders</router-link>
        <br>
        <br>
            <router-link :to="{name: 'GuestLogin'}">
                Ingredients 
                <span class="material-icons">expand_more</span>
            </router-link>
    </header>
</template>

<script>

export default {

}
</script>

<style>
    .restaurantHeader {
        width: 220px;
        height: 100%;
        background: #FFF;
        text-align: left;
        position: fixed;
        top: 0;
        left: 0;
    }

    .restaurantHeader img {
        width: 140px;
        display: block;
        margin: 50px auto;

    }

    .restaurantHeader .material-icons {
        vertical-align: bottom;
        font-size: 1.4em;
    }
    

    .restaurantHeader a {
        text-decoration: none;
        margin-left: 40px;
        color: #000;
    }

    .restaurantHeader .router-link-exact-active {
        font-weight: bold;
        border-bottom: 2px solid #000;
    }

    
</style>