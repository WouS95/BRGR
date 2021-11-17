<template>
  <div id="footer">
    <img src="../../assets/img/brgr-logo-black.svg" alt="logo" class="logo" />
    <div class="tabledetails">
      <p>
        Logged in as <br />
        <span
          >Table
          {{ tableNr }}
          <!-- input field for testing purposes -->
        </span>
      </p>
    </div>
    <p>Log out</p>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: ["tableNr"],
  setup(props) {
    const tableNr = ref(props.tableNr);
    return { tableNr };
  },
};
</script>

<style>
#footer {
  text-align: left;
  display: flex;
  padding: 0px 20px;
  gap: 30px;
  align-items: center;
  width: 100%;
  background-color: white;
  position: fixed;
  bottom: 0px;
  border-top: solid #E0E0E0 1px;
}
#footer img {
  width: 60px;
  flex: 0;
}
#footer .tabledetails {
  flex: 1;
}
</style>