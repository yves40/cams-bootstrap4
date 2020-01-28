<!--

  Identity.vue

  Nov 05 2019   Initial
  Nov 29 2019   Manage user info
  Dec 09 2019   Get some user login logout...logs
                Event date is formatted with a discovered Vue feature called Vue.filter
                Follow the formatdate track...
  Dec 12 2019   Add some info about user activity
  Dec 13 2019   Filter on user activity logs
  Dec 16 2019   Filters checkboxes are now in user store
  Dec 17 2019   filterbox setter problem
  Dec 19 2019   Now display user profiles
  Dec 20 2019   User profiles display
  Jan 07 2020   Fix small syntax error in vue log list ( b-row )
  Jan 28 2020   Display user privs in a compressed form
-->
<template>
  <div>
    <b-container>
      <!-- 
        Header and buttons to call the edit and delete pages
      -->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="2">
          <img src="../../../assets/users.png" />
        </b-col>
        <b-col cols="6">
              <b-navbar toggleable="sm">
                <b-navbar-toggle target="collapsemenu"></b-navbar-toggle>
                <b-collapse id="collapsemenu" is-nav>
                  <b-navbar-nav class="mr-auto">
                    <b-button pill variant="outline-primary" v-on:click="edit" >Edit my profile</b-button>
                    <b-button pill variant="outline-danger" v-on:click="deleteme" >Delete me</b-button>
                  </b-navbar-nav>
                </b-collapse>
              </b-navbar>
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

      <!-- 
        The user profiles dump section 
      -->
      <b-card>
        <b-card-text>
            <li>email      : {{email}}</li>
            <li>Pseudo     : {{name}}</li>
            <li>description: {{description}}</li>
            <li>Privileges : <strong>{{profiles}}</strong></li>
        </b-card-text>
      </b-card>

      <b-card>
        <b-card-text>
            Remaining session time : <strong>{{sessiontime}}</strong>
            <b-form-checkbox-group stacked v-model="filterbox" id="checkboxes">
              <b-form-checkbox value="0">Debug</b-form-checkbox>
              <b-form-checkbox value="1">Information</b-form-checkbox>
              <b-form-checkbox value="2">Warning</b-form-checkbox>
              <b-form-checkbox value="3">Error</b-form-checkbox>
              <b-form-checkbox value="4">Fatal</b-form-checkbox>
            </b-form-checkbox-group>
            <div class="textcenter underlined">Users logs</div>
        </b-card-text>
      </b-card>
      <!-- 
        The log dump window 
      -->
      <div class="viewframe" v-for="entry in userlogs" :key="entry.id">
        <b-row>
          <b-col cols="1"></b-col>
          <b-col v-if="entry.severity < '2'" class="loginf">
            {{entry.timestamp | formatdate}} - {{entry.message}}
          </b-col>
          <b-col v-else-if="entry.severity === '2'" class="logwarn">
            {{entry.timestamp | formatdate}} - {{entry.message}}
          </b-col>
          <b-col v-else-if="entry.severity === '3'" class="logerr">
            {{entry.timestamp | formatdate}} - {{entry.message}}
          </b-col>
          <b-col v-else-if="entry.severity === '4'" class="logfatal">
            {{entry.timestamp | formatdate}} - {{entry.message}}
          </b-col>
          <b-col v-else class="logfatal">
            {{entry.timestamp | formatdate}} - {{entry.message}}
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
// ------------------------------------------------------------------------------------------------------------
// The script
// ------------------------------------------------------------------------------------------------------------
const logger = require('../../core/services/logger');
const datetime = require('../../core/services/datetime');

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
      return {
        version: "Identity 1.57, Jan 28 2020 ",
      };
  },
  // ------------------------------------------------------------------------------------------------------------
  computed: {
    ...mapGetters (
        'userstore', { 
          userstoreversion:  'getVersion',
          email: 'getEmail',
          name: 'getName',
          description: 'getDescription',
          lastlogin: 'getLastlogin',
          sessiontime: 'getSessionTime',
          userlogs: 'getUserLogs',
          logged: 'isLogged',
          profiles: 'getUserProfiles'
        }
    ),
    filterbox: 
      {
        get() {
          return this.$store.state.userstore.filterbox;
        },
        set(value) {
          // Call a Vuex mutation (synchronous) to refresh the log query
          // and update the store 
          this.$store.commit('userstore/updateuserlogs', value );
        }
      },
  },  
  
  // ------------------------------------------------------------------------------------------------------------
  created() {
    this.$parent.disableMenu('identity');
  },
  beforeDestroy() {
    this.$parent.enableMenu('identity');
  },
  // ------------------------------------------------------------------------------------------------------------
  methods: {
    gotohome() {
      this.$router.push({ name: 'home' });
    },
    edit() {
      this.$router.push({ name: 'edit' });
    },
    deleteme() {
      this.$router.push({ name: 'deleteme' });
    },
  },
}
</script>
