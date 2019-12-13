<!--

  Identity.vue

  Nov 05 2019   Initial
  Nov 29 2019   Manage user info
  Dec 09 2019   Get some user login logout...logs
                Event date is formatted with a discovered Vue feature called Vue.filter
                Follow the formatdate track...
  Dec 12 2019   Add some info about user activity
  Dec 13 2019   Filter on user activity logs
-->
<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <img src="../../../assets/users.png" />
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
        User data
      -->
      <div class="viewframe">
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <p>Your email</p>
          </b-col>
          <b-col>
            <p>{{email}}</p>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>

        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <p>Pseudo</p>
          </b-col>
          <b-col>
            <p>{{name}}</p>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
        
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <p>Description</p>
          </b-col>
          <b-col>
            <p>{{description}}</p>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>

        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <p>Remaining session time</p>
          </b-col>
          <b-col>
            <p>{{sessiontime}}</p>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
      </div>
      <!-- 
        Logs
      -->
      <div class="viewframe">

        <!-- 
          The log dump header
        -->
        <b-row class="logheader">
          <b-col cols="2"></b-col>
          <b-col >
            <p>User recent activity</p>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
        <!-- 
          Filter with check boxes
        -->
        <b-row >
          <b-col cols="2"></b-col>
          <b-col >
                <b-form-checkbox-group v-model="filterbox" id="checkboxes">
                  <b-form-checkbox value="deb" unchecked-value="nodeb">Debug</b-form-checkbox>
                  <b-form-checkbox value="inf" unchecked-value="noinf">Information</b-form-checkbox>
                  <b-form-checkbox value="war">Warning</b-form-checkbox>
                  <b-form-checkbox value="err">Error</b-form-checkbox>
                  <b-form-checkbox value="fat">Fatal</b-form-checkbox>
                </b-form-checkbox-group>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
        <!-- 
          The log dump window 
        -->
        <div class="viewframe" v-for="entry in userlogs" :key="entry.id">
          <b-col cols="2"></b-col>
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
          <b-col cols="2"></b-col>
        </div>

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

import { mapGetters } from 'vuex'

export default {
  data() {
      return {
        version: "Identity 1.37, Dec 13 2019 ",
        filterbox: [ 'deb', 'inf', 'war', 'err', 'fat'],
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
          userlogs: 'getUserLogs'
        },
    ),
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
  },
  watch: {
    filterbox: {
      handler: (value) => {
        console.log('Filters  set to : ' + value);
      }
    },
  }
}
</script>
