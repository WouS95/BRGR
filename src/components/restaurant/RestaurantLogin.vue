<template>
  <img src="../../assets/img/brgr-logo-black.svg" alt="logo" class="logo" />
  <h1>Log in</h1>
  <form @submit.prevent="handleSubmit">
    <label for="email">Email</label>
    <input
      type="email"
      required
      placeholder="email"
      v-model="displayName"
      id="email"
    />
    <label for="password">Password</label>
    <input
      type="password"
      required
      placeholder="password"
      id="password"
      v-model="password"
    />
    <div class="error">{{ error }}</div>
    <button>Log in</button>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import useLogin from "../../composables/useLogin";
export default {
  emits: ["login"],
  setup(props, context) {
    // refs
    const displayName = ref("");
    const password = ref("");

    const { error, login } = useLogin();

    const handleSubmit = async () => {
      await login(email.value, password.value);
      if (!error.value) {
        context.emit("login");
      }
    };

    return { displayName, password, handleSubmit, error };
  },
};
</script>

<style>
</style>