<!--

  Home.vue

  Sep 28 2019   Initial
  Oct 02 2019   Fix the popup menu problem. Use ready() instead of created()
  Oct 03 2019   Grid setup
  Oct 04 2019   Some info
  Oct 05 2019   Reorg
  Oct 06 2019   1st vuex tests
  Oct 09 2019   Small change in content
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
              <p>
                This is the temporary home page. This application will manage webcams.
                The goal is to easily monitor their status, set alarm on and off, based on time schedule,
                and then get the Video stream and display it in one or more windows.
                The technology used are :
              </p>
                <b-list-group >
                  <b-list-group-item>{{version}}</b-list-group-item>
                  <b-list-group-item >MongoDB</b-list-group-item>
                  <b-list-group-item >Vue</b-list-group-item>
                  <b-list-group-item >Vuex</b-list-group-item>
                  <b-list-group-item >Bootstrap and Bootstrap-Vue</b-list-group-item>
                  <b-list-group-item >Nodejs</b-list-group-item>
                  <b-list-group-item >Express</b-list-group-item>
                </b-list-group>
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
      version: "Home 1.45, Oct 09 2019"
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
