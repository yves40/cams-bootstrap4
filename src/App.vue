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
  Oct 25 2019   Header content
  Nov 04 2019   Display user info
  Nov 05 2019   WIP on header area
  Nov 06 2019   Drop Menus for login/logout
                Change menu management for login/logout/register...
  Nov 07 2019   Finally use a logout page...
                Some work on menus
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
                    >{{ submenu.text }}
                  </b-dropdown-item>
                </div>
              </b-nav-item-dropdown>
            </div>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="!logged" v-bind:to="{ name: 'login' }">Login</b-nav-item>
            <b-nav-item v-if="logged" v-bind:to="{ name: 'logout' }">Logout</b-nav-item>
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
            <ul class="list-group list-group-horizontal-sm">
              <li class="list-group-item list-group-item-dark">{{mongostate}}</li>
              <li class="list-group-item list-group-item-primary" v-if="logged">{{email}}</li>
              <li class="list-group-item list-group-item-primary" v-if="logged">Log time: {{lastlogin}}</li>
              <li class="list-group-item list-group-item-primary" v-if="logged">Time remaining : {{sessiontime}}</li>
            </ul>
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

import logger from './modules/core/services/logger';
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "app",
  data() {
      return {
        version: "Cams Manager 2.18, Nov 07 2019",
        copyright: "oldtimerSoft",
        // These arrays are defining the displayed menus
        // enableflag drives the visibility of the URL
        // disableflag drives the active/inactive state
        topmenu: [
          {
            text: "User",
            enableflag: true,
            navoptions: [
              {url: "login",text: "Login", enableflag: true, disableflag: false, },
              {url: "logout",text: "Logout", enableflag: false, disableflag: false,},
              {url: "register",text: "Register", enableflag: true, disableflag: false, },
            ]
          },
          {
            text: "Bootstrap4",
            enableflag: false,
            navoptions: [
              {url: "buttons",text: "buttons",enableflag: true,disableflag: false, },
              { url: "tabs", text: "tabs", enableflag: true, disableflag: false,  },
              { url: "form", text: "form", enableflag: true, disableflag: false,  },
              {url: "pagination",text: "pagination",enableflag: true,disableflag: false, },
              {url: "template",text: "template",enableflag: true,disableflag: false, }
            ]
          },
          {
            text: "About",
            enableflag: true,
            navoptions: [
              {url: "about",text: "about",enableflag: true,disableflag: false, },
            ]
          }
        ]
      };
    },

  computed: {
    ...mapGetters (
        'corestore', { 
            today: 'getToday',
            hms: 'getHM',
            corestoreversion: 'getVersion',
        },
    ),
    ...mapGetters (
        'mongostore', { 
            mongostoreversion: 'getVersion',
            mongostate: 'getMongoStatus',
        },
    ),
    ...mapGetters(
        'userstore', {
          email: 'getEmail',
          name: 'getName',
          description: 'getDescription',
          lastlogin: 'getLastlogin',
          logged: 'isLogged',
          sessiontime: 'getSessionTime',
        }
    ),
    checkmongo() {
      return !this.$store.getters['mongostore/IsMongoDown'];
    },
  },

  mounted() {
    this.$store.dispatch("corestore/settimer");
    this.$store.dispatch('mongostore/setMongoTimer');  // Used to periodically check mongodb server status
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
    enableMenu(label) {
      let outer = 0;
      for (outer in this.topmenu) {
        let menuentry = this.topmenu[outer].navoptions.find( menu => label === menu.url );
        if(menuentry) {
          menuentry.enableflag = true;
          break;
        }
      }
    },
    disableMenu(label) {
      let outer = 0;
      for (outer in this.topmenu) {
        let menuentry = this.topmenu[outer].navoptions.find( menu => label === menu.url );
        if(menuentry) {
          menuentry.enableflag = false;
          break;
        }
      }
    },
    enableTopMenu(label) {
      let menuentry = this.topmenu.find( menu => label === menu.text );
      if(menuentry) menuentry.enableflag = true;
    },
    disableTopMenu(label) {
      let menuentry = this.topmenu.find( menu => label === menu.text );
      if(menuentry) menuentry.enableflag = false;
    },
  },
};
</script>
