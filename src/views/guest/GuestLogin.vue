<template>
    <div class="loginLogoContainer">
        <p>Welcome to</p>
        <img src="../../assets/img/brgr-logo-white.svg">
    </div>
    <div class="loginContainer">
        <p>Please enter your table number</p>
        <form @submit.prevent="handleSubmit">
            <input v-model="tableNr" type="number" required>
            <button>Log in</button>
        </form>
    </div>
</template>

<script>
import {ref} from 'vue'
import {useRouter} from 'vue-router'

export default {

    setup (props, context) {
        const router = useRouter()
        const tableNr = ref(null)

        // redirects to orders page from the selected tableNr
        const handleSubmit = () => {
            router.push({name: "GuestOrders", params: { tableNr: tableNr.value }})
        }

        return {tableNr, handleSubmit}
    }

}
</script>

<style>
.loginContainer {
    width: 100%;
    height: 300px;
    background: #FFF;
    position: absolute;
    bottom: 0px;
}

.loginContainer input { 
    display: block;
    margin: auto;
    border: solid #E0E0E0 1px;
    border-bottom: solid #757575 2px;
    height: 60px;
    text-align: center;
    font-size: 2em;
    width: 100px;
}

.loginLogoContainer {
    margin-top: 100px;
}

.loginContainer button {
    margin-top: 30px;
    padding: 1.2em 1.7em;
    font-size: 100%;
}

.loginContainer p {
    margin-top: 40px;
}

.loginLogoContainer p {
    color: #FFF;
    font-size: 1.2em;
}

.loginLogoContainer img {
    width: 40%;
    max-width: 400px;
    min-width: 200px;
    vertical-align: middle;
}


</style>