<template>
  <router-view />
</template>

<style>
* {
  box-sizing: border-box;
}
body,
html {
  background: #1b5e20;
  margin: 0;
  font-size: 18px;
}

#app {
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
}
button {
  background-color: #d32f2f;
  border: none;
  color: white;
  padding: 1em 2.5em;
  border-radius: 2em;
  cursor: pointer;
  font-weight: 500;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
