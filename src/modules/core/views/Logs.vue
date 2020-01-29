<!--

  Logs.vue

  Jan 29 2020   Initial

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
        version: "Logs 1.00, Jan 29 2020 ",
      };
  },
  // ------------------------------------------------------------------------------------------------------------
  computed: {
    ...mapGetters (
        'userstore', { 
          userlogs: 'getUserLogs',
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
    this.$parent.disableMenu('logs');
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
