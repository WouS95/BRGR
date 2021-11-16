<template>
    <header class="restaurantHeader">
        <img src="../../assets/img/brgr-logo-black.svg">
        <router-link :to="{name: 'RestaurantOrders'}">Orders</router-link>
        <br>
        <br>
            <router-link :to="{name: 'Ingredients'}" active-class="/ingredients">
                Ingredients 
            </router-link>
            <div class="userInfo" v-if="user">
                <p class="subtitle">Logged in as</p>
                <p><strong>{{ user.displayName}}</strong></p>
                <button @click="logoutUser">
                    <span class="material-icons">logout</span>
                    Log out
                </button>
            </div>
    </header>
</template>

<script>
import getUser from '../../composables/getUser'
import useLogout from '../../composables/useLogout'
import { useRouter } from 'vue-router'


export default {
    setup(){
        const router = useRouter()
        const { user } = getUser()
        const { logout, error } = useLogout()

        const logoutUser = () => {
            logout()
            router.push({name: "Restaurant"})
        }

        return { user, logout , error, logoutUser }
    }

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

    .restaurantHeader .userInfo {
        position: absolute;
        bottom: 50px;
        margin-left: 40px;
    }

    .restaurantHeader .userInfo p {
        margin: 0px;
    }
    .restaurantHeader .userInfo button {
        margin-top: 30px;
    }

    

    
</style>