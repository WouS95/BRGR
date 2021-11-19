<template>
  <div class="login">
    <div v-if="showLogin">
      <RestaurantLogin @login="toOrders" />
      <p class="togglelogin" @click="showLogin = false">
        No member yet? create account
      </p>
    </div>
    <div v-else>
      <RestaurantSignup @signup="toOrders" />
      <p class="togglelogin" @click="showLogin = true">
        Already a member? Log in
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import RestaurantLogin from "../../components/restaurant/RestaurantLogin.vue";
import RestaurantSignup from "../../components/restaurant/RestaurantSignup.vue";
import { useRouter } from "vue-router";

export default {
  components: { RestaurantLogin, RestaurantSignup },
  setup() {
    const showLogin = ref(true);
    const router = useRouter();
    const toOrders = () => {
      router.push({ name: "RestaurantOrders" });
    };

    return { showLogin, toOrders };
  },
};
</script>

<style>
.login {
  background: white;
  width: 500px;
  max-width: 95vw;
  margin: 40px auto;
  padding: 50px;
  border-radius: 20px;
  text-align: center;
}

.login h1 {
  color: #000;
}

.login .logo {
  margin-top: 50px;
  width: 50%;
  min-width: 250px;
}
.login h1 {
  font: normal normal 600 40px/60px Poppins;
}
.login form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}
.login form input {
  padding: 15px;
  font-size: 100%;
  border: 1px solid #e0e0e0;
  border-bottom: 2px solid #757575;
}

.login form button {
  align-self: flex-start;
  font-size: 100%;
  margin: auto;
}

.login .togglelogin {
  align-self: flex-start;
  cursor: pointer;
}
.login .togglelogin:hover {
  text-decoration: underline;
}
.login .error {
  color: #d32f2f;
  font-size: 80%;
  font-weight: 600;
}
</style>