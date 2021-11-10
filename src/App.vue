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
  font-family: Poppins, Helvetica, Arial, sans-serif;
  background-color: #d32f2f;
  border: none;
  color: white;
  padding: 0.6em 1em;
  border-radius: 2em;
  cursor: pointer;
  font-weight: 500;
}

button .material-icons {
    height: none;
    vertical-align: middle;
}

button p {
  display: inline-block;
  padding: 0px 6px;
  margin: 0px;
}

.subtitle {
        margin: 0px;
        font-size: 0.9em;
        color: #757575;
    }

</style>
