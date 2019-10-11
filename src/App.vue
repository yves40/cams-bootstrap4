<!--
  App.vue

  Sep 28 2019   Initial
  Sep 30 2019   css
  Oct 01 2019   Menus..
  Oct 02 2019   Menu popup not hiding after select 
  Oct 03 2019   Dropdown problem
  Oct 04 2019   Dropdown problem unsolved, discarded. Few changes on copyright
  Oct 09 2019   About, date in header bar
  Oct 10 2019   About, date in Menu bar.
  Oct 11 2019   Date / hour in Menu bar. Change meun look 
-->

<template>
  <div id="app">
    <!-- ------------------------------------------------------------------------- -->
    <div id="menu">
      <b-navbar toggleable="sm" class="navbar-dark bg-dark" fixed="top">
        <b-navbar-toggle target="collapsetop"></b-navbar-toggle>
        <b-collapse id=collapsetop is-nav>
          <b-navbar-brand v-bind:to="{ name: 'home' }">Home</b-navbar-brand>
          <b-navbar-nav class="mr-auto"> 
            <div v-for="entry in topmenu" :key="entry.id"> <!-- Load menus and sub menus -->
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
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-bind:to="{ name: 'login' }">Login</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <!-- ------------------------------------------------------------------------- -->
    <div id="header">
      <b-container>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <h1>{{ headermsg }}</h1>
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
        <b-navbar toggleable="sm" class="navbar-dark bg-dark" fixed="bottom">
          <b-navbar-toggle target="collapsebottom"></b-navbar-toggle>
          <b-collapse id=collapsebottom is-nav>
            <b-navbar-nav class="mr-auto">
              <b-nav-text >{{version}} by &copy;{{copyright}}</b-nav-text>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-text>{{today}} [ {{hms}} ]</b-nav-text>
            </b-navbar-nav>
          </b-collapse> 
        </b-navbar>
      </div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
  name: "app",
  data() {
      return {
        headermsg: "Placeholder for future use, i.e, info on logged user",
        version: "Cams Manager 1.79, Oct 11 2019",
        copyright: "oldtimerSoft, 2019",
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

  computed: {
    ...mapGetters (
        'corestore', { today: 'getToday',
                       hms: 'getHM'},
    ),
  },

  mounted() {
    this.$store.dispatch("corestore/settimer");
  },

methods: {
    ...mapActions(
        'corestore', { 
          settimer: 'settimer',
        }
    ),
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
    },
  },
};
</script>
