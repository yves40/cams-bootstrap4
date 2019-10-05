<!--

  Home.vue

  Sep 28 2019   Initial
  Oct 02 2019   Fix the popup menu problem. Use ready() instead of created()
  Oct 03 2019   Grid setup
  Oct 04 2019   Some info
  Oct 05 2019   Reorg
-->
<template>
  <div>
      <b-container>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <img src="../../../assets/WIP.png" />
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            {{ version }}
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
      </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      version: "Home 1.38, Oct 05 2019"
    };
  },
  created() {
    this.$parent.disableMe('home');
  },
  beforeDestroy() {
    this.$parent.enableMe('home');
  },
};
</script>
