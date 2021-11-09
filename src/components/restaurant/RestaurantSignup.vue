<template>
  <img src="../../assets/img/brgr-logo-black.svg" alt="logo" class="logo" />
  <h1>Sign up</h1>
  <form @submit.prevent="handleSubmit">
    <label for="username">Username</label>
    <input
      id="username"
      type="text"
      required
      placeholder="username"
      v-model="displayName"
    />
    <label for="email">Email</label>
    <input
      id="email"
      type="email"
      required
      placeholder="email"
      v-model="email"
    />
    <label for="password">Password</label>
    <input
      id="password"
      type="password"
      required
      placeholder="password"
      v-model="password"
    />
    <div class="error">{{ error }}</div>
    <button>Sign up</button>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import useSignup from "../../composables/useSignup";
export default {
  setup() {
    const { error, signup } = useSignup();
    // refs
    const displayName = ref("");

    const email = ref("");
    const password = ref("");

    const handleSubmit = async () => {
      await signup(email.value, password.value, displayName.value);
      console.log("user signed up");
    };

    return { displayName, email, password, handleSubmit, error };
  },
};
</script>

<style>
</style>