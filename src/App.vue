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
img {
  max-width: 100%;
}

button .material-icons {
  height: none;
  vertical-align: middle;
}

button p {
  display: inline-block;
  padding: 0px 0.3em;
  margin: 0px;
}

.menuitemslist {
  text-align: right;
}

.unavailable {
  background-color: #9c0000;
}
.available {
  background-color: #45be3a;
}
.icon {
  height: 15px;
}
.menuedits {
  background-color: white;
  width: auto;
  padding: 1em 2.5em;
  border-radius: 1em;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.subtitle {
  margin: 0px;
  font-size: 0.9em;
  color: #757575;
}

button {
  font-size: 100%;
}
</style>
