<!--

  Identity.vue

  Nov 05 2019   Initial
  Nov 29 2019   Manage user info
  Dec 09 2019   Get some user login logout...logs
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
      <div class="viewframe">

        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <p>User recent activity</p>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
        <div class="viewframe" v-for="entry in userlogs" :key="entry.id">
          <b-col cols="2"></b-col>
          <b-col >
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
        version: "Identity 1.08, Dec 09 2019 ",
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
  }
};
</script>
