<!--

  Logs.vue

  Jan 29 2020   Initial
  Jan 30 2020   WIP on log search filter
  Jan 31 2020   Work on log list.
  Feb 05 2020   Work on log list..
  Feb 07 2020   Work on log list...Manage the message search filter
  Feb 09 2020   Add dates to filter results
  Feb 10 2020   Date filters
  Feb 12 2020   Date filters, and list display

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
      <b-row>
        <b-col md="3">
        <b-card header="Log level displayed" >
          <b-card-text>
              <b-form-checkbox-group stacked v-model="filterbox" id="checkboxes">
                <b-form-checkbox value="0">Debug</b-form-checkbox>
                <b-form-checkbox value="1">Information</b-form-checkbox>
                <b-form-checkbox value="2">Warning</b-form-checkbox>
                <b-form-checkbox value="3">Error</b-form-checkbox>
                <b-form-checkbox value="4">Fatal</b-form-checkbox>
              </b-form-checkbox-group>
          </b-card-text>
        </b-card>
        </b-col>
        <b-col md="9">
        <b-card header="Filters">
          <b-form inline>
            <b-form-group class="mt-2">
              <b-form-input
                id="messagefilter"
                class="mb-2"
                v-model="messagefilter"
                placeholder="Message search filter">
              </b-form-input>
            </b-form-group>
          </b-form>
          <b-container>
            <b-row>
              <b-col sm="3" align-self="center">
                  <label for="startdate">From</label>
              </b-col>
              <b-col sm="5">
                  <b-form-input id="startdate" type="date" v-model="startdate"></b-form-input>
              </b-col>
              <b-col sm="3">
                  <b-form-input id="starthour" type="time" v-model="starthour"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="3" align-self="center">
                <label for="enddate">To</label>
              </b-col>
              <b-col sm="5">
                <b-form-input id="endtdate" type="date" v-model="enddate"></b-form-input>
              </b-col>
              <b-col sm="3">
                  <b-form-input id="endhour" type="time" v-model="endhour"></b-form-input>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
        </b-col>
      </b-row>

      <b-card header="Logs initially sorted in reverse date, from most recent to older">
        <span class="verticalalign margintopbottom0 underlined">Max number of returned lines : {{maxlines}}</span>
        <b-table striped hover small bordered :items="thelogs" :fields="fields" responsive="sm" tbody-tr-class="small">
          <template v-slot:cell(timestamp)="item">
            {{item.value  | formatdate}}
          </template>
        </b-table>
      </b-card>
    </b-container>
  </div>
</template>

<script>
// ------------------------------------------------------------------------------------------------------------
// The script
// ------------------------------------------------------------------------------------------------------------
const logger = require('../../core/services/logger');
const datetime = require('../../core/services/datetime');
const properties = require('../../core/services/properties')

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
      return {
        version: "Logs 1.54, Feb 12 2020 ",
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
        maxlines: properties.LOGLISTMAX,
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
        get() {return this.$store.state.logstore.severityfilter;},
        set(value) {
          // Call a Vuex mutation (synchronous) to refresh the log query
          // and update the store
          this.$store.dispatch('logstore/loadLogs', [ value, this.messagefilter, this.startdate, this.enddate ] );
        }
      },
    messagefilter: 
      {
        get() {return this.$store.state.logstore.messagefilter;},
        set(value) {
          // Use a timeout to avoid calling the store service for every keystroke 
          if (this.timeoutsid !== null)
              clearTimeout(this.timeoutsid);
          this.timeoutsid = setTimeout( () => {
            this.$store.dispatch('logstore/loadLogs', [ this.filterbox, value, this.startdate, this.enddate ]);
          }, 600);
        }
      },
      startdate: {
        get() {return this.$store.state.logstore.startdate;},
        set(value) {
          this.$store.dispatch('logstore/loadLogs', [ this.filterbox, this.messagefilter, value, this.enddate ]);
        }
      },
      starthour: {
          get() {return this.$store.state.logstore.starthour;},
          set(value) { 
            console.log(`Start Hour is ${starthour}`)
          }
        },
      enddate: {
        get() {return this.$store.state.logstore.enddate;},
        set(value) {
            this.$store.dispatch('logstore/loadLogs', [ this.filterbox, this.messagefilter, this.startdate, value ]);
          },
        },
      endhour: {
          get() {return this.$store.state.logstore.endhour;},          
          set(value) { 
            console.log(`End Hour is ${endhour}`)
          }
        },
  },  
  
  // ------------------------------------------------------------------------------------------------------------
  created() {
    //this.$parent.disableMenu('logs');
    this.$store.dispatch('logstore/resetDates');
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
