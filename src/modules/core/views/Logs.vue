<!--

  Logs.vue

  Jan 29 2020   Initial
  Jan 30 2020   WIP on log search filter

-->
<template>
  <div>
    <b-container>

      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <p>{{version}}</p>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>

      <div>
        <b-table striped hover :items="all_logs"></b-table>
      </div>

      <b-card>
        <b-card-text>
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
        version: "Logs 1.07, Jan 30 2020 ",
        /*
        all_logs: [],
        [ 
          { age: 40, name: 'Yves', email: 'yves@free.fr' },
          { age: 40, name: 'Yves', email: 'yves@free.fr' },
          { age: 40, name: 'Yves', email: 'yves@free.fr' },
        ],*/
      };
  },
  // ------------------------------------------------------------------------------------------------------------
  computed: {
    ...mapGetters (
        'userstore', { 
          userlogs: 'getUserLogs',
        },
        'logstore', { 
          all_logs: 'getLogs',
        },
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
    this.$parent.disableMenu('logs');
    // this.alllogs = this.$store.getters['logstore/getLogs'];
  },
  beforeDestroy() {
    this.$parent.enableMenu('logs');
  },
  // ------------------------------------------------------------------------------------------------------------
  methods: {
    gotohome() {
      this.$router.push({ name: 'home' });
    },
  },
}
</script>
