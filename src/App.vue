<!--
  App.vue

  Sep 28 2019   Initial
  Sep 30 2019   css
  Oct 01 2019   Menus..
  Oct 02 2019   Menu popup not hiding after select 
  Oct 03 2019   Dropdown problem
  Oct 04 2019   Dropdown problem unsolved, discarded. Few changes on copyright
  Oct 09 2019   About, date in header bar
-->

<template>
  <div id="app">
    <!-- ------------------------------------------------------------------------- -->
    <div id="menu">
      <b-container>
        <b-row>
          <b-col cols="1"></b-col>
          <b-col>
            <!-- 
              variant can be set as : primary, success, info, warning, danger, dark, or light
            -->
            <b-navbar fixed="top" type="dark" variant="primary">
              <b-navbar-brand v-bind:to="{ name: 'home' }">Home</b-navbar-brand>
              <b-navbar-nav>
                <b-nav-item text="Home"></b-nav-item>
              </b-navbar-nav>
              <b-navbar-nav>
                <div v-for="entry in topmenu" :key="entry.id">
                  <b-nav-item-dropdown
                    :id="entry.text"
                    :text="entry.text"
                    v-show="entry.enableflag"
                  >
                    <div v-for="submenu in entry.navoptions" :key="submenu.id">
                      <b-dropdown-item
                        v-bind:to="submenu.url"
                        :disabled="submenu.disableflag"
                        v-show="submenu.enableflag"
                      >{{ submenu.text }}</b-dropdown-item>
                    </div>
                  </b-nav-item-dropdown>
                </div>
                <!--
                -->
              </b-navbar-nav>
            </b-navbar>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
      </b-container>
    </div>
    <!-- ------------------------------------------------------------------------- -->
    <div id="header">
      <b-container>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <h1>{{ msg }}</h1>
            <h2>{{ version }} : {{today}}</h2>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
      </b-container>
    </div>
    <!-- ------------------------------------------------------------------------- -->
    <div id="appzone">
      <router-view></router-view>
    </div>
    <!-- ------------------------------------------------------------------------- -->
    <div id="footer">
      <b-container>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
              <p>&copy;{{copyright}}</p>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: "app",
  computed: {
    ...mapGetters (
        'corestore', { today: 'getToday'},
      )
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js Application",
      version: "App 1.68, Oct 09 2019",
      copyright: "MEVN template by oldtimerSoft",
      // These arrays are defining the displayed menus
      // enableflag drives the visibility of the URL
      // disableflag drives the active/inactive state
      topmenu: [
        {
          text: "User",
          enableflag: true,
          navoptions: [
            {url: "login",text: "Login",enableflag: true,disableflag: false},
            {url: "register",text: "Register",enableflag: true,disableflag: false}
          ]
        },
        {
          text: "Bootstrap4",
          enableflag: true,
          navoptions: [
            {url: "buttons",text: "buttons",enableflag: true,disableflag: false},
            { url: "tabs", text: "tabs", enableflag: true, disableflag: false },
            { url: "form", text: "form", enableflag: true, disableflag: false },
            {url: "pagination",text: "pagination",enableflag: true,disableflag: false},
            {url: "template",text: "template",enableflag: true,disableflag: false}
          ]
        },
        {
          text: "About",
          enableflag: true,
          navoptions: [
            {url: "about",text: "about",enableflag: true,disableflag: false},
          ]
        }
      ]
    };
  },
  methods: {
    // These methods are used by application pages to disable their menu entries
    // No need to display a login entry in a menu if you're on the login page
    // See the created() and beforeDestroy() methods in slave pages
    disableMe(label) {
      let inner,
      outer = 0;
      for (outer in this.topmenu) {
        for (inner in this.topmenu[outer].navoptions) {
          if (this.topmenu[outer].navoptions[inner].url === label) {
            this.topmenu[outer].navoptions[inner].enableflag = false;
            break;
          }
        }
      }
    },
    enableMe(label) {
      let inner,
      outer = 0;
      for (outer in this.topmenu) {
        for (inner in this.topmenu[outer].navoptions) {
          if (this.topmenu[outer].navoptions[inner].url === label) {
            this.topmenu[outer].navoptions[inner].enableflag = true;
            break;
          }
        }
      }
    }
  }
};
</script>
