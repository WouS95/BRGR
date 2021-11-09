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
    <button>Sign up</button>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  setup() {
    // refs
    const displayName = ref("");

    const email = ref("");
    const password = ref("");

    const handleSubmit = () => {
      console.log(displayName.value, email.value, password.value);
    };

    return { displayName, email, password, handleSubmit };
  },
};
</script>

<style>
</style>