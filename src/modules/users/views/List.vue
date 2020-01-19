<!--

  List.vue

  Jan 17 2020   Initial
  Jan 18 2020   Parameters for the user list sent to the userliststore
  Jan 19 2020   Link and zoom on user's details
-->
<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="2">
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
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <b-form inline>
            <label class="sr-only" for="emailfilter">User filter</label>
            <b-form-group class="mt-2"
              description="User search filter (based on email)"
               label="Search filter"
            >
              <b-form-input
                id="emailfilter"
                class="mb-2"
                v-model="userfilter"
                placeholder="User email">
              </b-form-input>
            </b-form-group>
          </b-form>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
      <!-- 
        The users dump window 
      -->
      <div class="mt-2 ml-1 mr-1">
        <div class="viewframe" v-for="entry in userlist" :key="entry._id" >
          <b-row>
            <b-col cols="4">{{entry.email}}</b-col>
            <b-col cols="8"><b-link><img src="../../../assets/search.png"></b-link></b-col>            
          </b-row>
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
const helpers = require('../../core/services/helpers');

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
      return {
        version: "List 1.25, Jan 19 2020 ",
        timeoutsid: null,
      }
  },
  methods: {
  },
  // ------------------------------------------------------------------------------------------------------------
  computed: {
    ...mapGetters (
        'userliststore', { 
          storeversion:  'getVersion',
          userlist: 'getUsersList',
        }
    ),
    userfilter: 
      {
        get() {
          return this.$store.state.userliststore.filter;
        },
        set(value) {
          // Use a timeout to avoid calling the store service for every keystroke 
          if (this.timeoutsid !== null)
              clearTimeout(this.timeoutsid);
          this.timeoutsid = setTimeout( () => {
            this.$store.dispatch('userliststore/loadUsersList',  value );
          }, 600);
        }
      },
  },  
  
  // ------------------------------------------------------------------------------------------------------------
  created() {
    this.$store.dispatch('userliststore/loadUsersList', this.emailfilter);
    this.$parent.disableMenu('listusers');
  },
  beforeDestroy() {
    this.$parent.enableMenu('listusers');
  },
  // ------------------------------------------------------------------------------------------------------------
  methods: {
    gotohome() {
      this.$router.push({ name: 'home' });
    },
  },
}
</script>
