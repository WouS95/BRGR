<template>
  <div id="footer">
    <img src="../../assets/img/brgr-logo-black.svg" alt="logo" class="logo" />
    <div class="tabledetails">
        <p class="subtitle">Logged in as </p>
        <span>Table {{ tableNr }} </span>
    </div>
    <router-link :to="{name: 'GuestLogin'}">Log out</router-link>
  </div>
</template>

<script>
export default {
  props: ["tableNr"],
};
</script>

<style>
#footer {
  text-align: left;
  display: flex;
  padding: 20px 25px;
  gap: 20px;
  align-items: center;
  width: 100%;
  background-color: white;
  position: fixed;
  bottom: 0px;
  border-top: solid #E0E0E0 1px;
}
#footer img {
  width: 75px;
  flex: 0;
}
#footer .tabledetails {
  flex: 1;
}

#footer span {
  font-weight: 600;
}

#footer .subtitle {
  font-size: 0.8em;
}

#footer a {
  text-decoration: none;
  font-weight: 500;
  color: #000;
}

</style>