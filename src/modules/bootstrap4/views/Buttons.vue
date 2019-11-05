<!--
  Buttons.vue

  Oct 01 2019   Initial
  Oct 02 2019   Fix the popup menu problem. Use ready() instead of created()
  Oct 03 2019   Grid setup
  Oct 04 2019   Elements positions
  Oct 05 2019   Elements positions
  Oct 27 2019   Buttons positions when window resized to minimum
-->
<template>
  <div class="bootstrap" id="buttons">
      <b-container>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <img src="../../../assets/bootstrap-vue.png" />
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
        <div class="identification">
          <b-row>
            <b-col cols="2"></b-col>
            <b-col>{{ msg }}</b-col>
            <b-col cols="2 "></b-col>
          </b-row>
          <b-row>
            <b-col cols="2"></b-col>
            <b-col>{{ version }}</b-col>
            <b-col cols="2 "></b-col>
          </b-row>
        </div>
        <div>
          <b-navbar toggleable="sm">
            <b-navbar-toggle target="collapsemenu"></b-navbar-toggle>
            <b-collapse id=collapsemenu is-nav>
              <b-navbar-nav class="mr-auto">
                  <b-button pill v-on:click="standard">Standard </b-button>
                  <b-button pill variant="danger" v-on:click="danger" >Danger</b-button>
                  <b-button pill variant="success" v-on:click="success">Success</b-button>
                  <b-button pill variant="outline-primary" v-on:click="outline">Outline</b-button>
                  <b-dropdown id="dropdown-1" text="Dropdown" class="m-md-2">
                    <b-dropdown-item v-on:click="first">First Action</b-dropdown-item>
                    <b-dropdown-item v-on:click="second">Second Action</b-dropdown-item>
                    <b-dropdown-item v-on:click="third">Third Action</b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item  v-on:click="active" active>Active action</b-dropdown-item>
                    <b-dropdown-item  v-on:click="disabled" disabled>Disabled action</b-dropdown-item>
                  </b-dropdown>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>              
      </b-container>
  </div>
</template>
<script>

const Logger = require('../../core/services/logger');

export default {
  data() {
    return {
      msg: "bootstrap4 button widgets",
      version: "buttons 1.25, Oct 27 2019"
    };
  },
  methods: {
    danger() {Logger.debug('Danger here !!!!!!!!!!!!!');},
    standard() {Logger.debug('Standard here !!!!!!!!!!!!!');},
    success() {Logger.debug('success here !!!!!!!!!!!!!');},
    outline() {Logger.debug('outline here !!!!!!!!!!!!!');},
    first() {Logger.debug('1st here !!!!!!!!!!!!!');},
    second() {Logger.debug('2nd here !!!!!!!!!!!!!');},
    third() {Logger.debug('3rd here !!!!!!!!!!!!!');},
    active() {Logger.debug('active here !!!!!!!!!!!!!');},
    disabled() {Logger.debug('disabled here !!!!!!!!!!!!!');},
  },
  created() {
    this.$parent.disableMe('buttons');
  },
  beforeDestroy() {
    this.$parent.enableMe('buttons');
  },
};
</script>
