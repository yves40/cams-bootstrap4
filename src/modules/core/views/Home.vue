<!--

  Home.vue

  Sep 28 2019   Initial
  Oct 02 2019   Fix the popup menu problem. Use ready() instead of created()
  Oct 03 2019   Grid setup
  Oct 04 2019   Some info
  Oct 05 2019   Reorg
  Oct 06 2019   1st vuex tests
  Oct 09 2019   Small change in content
  Nov 07 2019   Small change in content
  Dec 21 2019   Simpler
-->
<template>
  <div>
      <b-container>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <img src="../../../assets/process.png" />
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <p>{{version}}</p>
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
                This is an MEVN based application. MEVN stands for Mongodb, Express, Vuejs, Nodejs.
                The application uses technologies such as MongoDB, mongoose, Express, Vue, Vuex,Nodejs, Bootstrap 
                and Bootstrap-Vue, Axios, passport, json web token
              <p></p>
              <p>
                And some other libraries...
              </p>
              <p>
                The goal is to learn some modern dev techniques.
                Seems pretty simple for young development experts, but for an old timer like me, who worked on SQL, 
                PL/SQL, C, C++, Java, Struts, Servlets, etc. during part of its life, its a huge challenge ;-)
              </p>
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
      version: "Home 1.46, Dec 21 2019"
    };
  },
  created() {
    this.$parent.disableMenu('home');
  },
  beforeDestroy() {
    this.$parent.enableMenu('home');
  },
};
</script>
