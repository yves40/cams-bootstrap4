<!--

  Logs.vue

  Jan 29 2020   Initial
  Jan 30 2020   WIP on log search filter
  Jan 31 2020   Work on log list.
  Feb 05 2020   Work on log list..

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

      <b-card>
        <b-card-text>
            <b-form-checkbox-group stacked v-model="filterbox" id="checkboxes">
              <b-form-checkbox value="0">Debug</b-form-checkbox>
              <b-form-checkbox value="1">Information</b-form-checkbox>
              <b-form-checkbox value="2">Warning</b-form-checkbox>
              <b-form-checkbox value="3">Error</b-form-checkbox>
              <b-form-checkbox value="4">Fatal</b-form-checkbox>
            </b-form-checkbox-group>
        <b-form inline>
          <label class="sr-only" for="messagefilter">Message filter</label>
          <b-form-group class="mt-2"
            description="Message search filter (based on message field)"
              label="Message filter"
          >
            <b-form-input
              id="messagefilter"
              class="mb-2"
              v-model="messagefilter"
              placeholder="Message">
            </b-form-input>
          </b-form-group>
        </b-form>
            <div class="textcenter underlined">Logs</div>
        </b-card-text>
      </b-card>
      <div>
        <b-table striped hover small bordered :items="thelogs" :fields="fields" responsive="sm" tbody-tr-class="small">
          <template v-slot:cell(timestamp)="item">
            {{item.value  | formatdate}}
          </template>
        </b-table>
      </div>


      <!-- 
        The log dump window 
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
      -->
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
        version: "Logs 1.32, Feb 05 2020 ",
        all_logs: [ ],
        fields: [         // Some displayed fields in the table
          {key: 'timestamp', label: 'Time', sortable:true},
          {key: 'email', sortable:true},
          {key: 'message'},
          // {key: 'severity', sortable:true, label: 'Level'},
          {key: 'category', sortable:true},
          {key : 'module', sortable: false},
        ],
        timeoutsid: null,
      };
  },
  // ------------------------------------------------------------------------------------------------------------
  computed: {
    ...mapGetters (
        'logstore', { 
          updatecount: 'getUpdateCount',
          thelogs: 'getLogs',
        },
    ),
    ...mapGetters (
        'userstore', { 
          userlogs: 'getUserLogs',
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
          this.$store.dispatch('logstore/loadLogs', value );
        }
      },
    messagefilter: 
      {
        get() {
          return this.$store.state.logstore.filter;
        },
        set(value) {
          // Use a timeout to avoid calling the store service for every keystroke 
          if (this.timeoutsid !== null)
              clearTimeout(this.timeoutsid);
          this.timeoutsid = setTimeout( () => {
            console.log('this.$store.dispatch(logstore/loadLogs,' +   value + ')');
            // this.$store.dispatch('logstore/loadLogs',  value );
          }, 600);
        }
      },
  },  
  
  // ------------------------------------------------------------------------------------------------------------
  created() {
    //this.$parent.disableMenu('logs');
    this.$store.dispatch('logstore/loadLogs');
  },
  beforeDestroy() {
    //this.$parent.enableMenu('logs');
  },
  // ------------------------------------------------------------------------------------------------------------
  methods: {
    gotohome() {
      this.$router.push({ name: 'home' });
    },
  },
}
</script>
