<!--

  List.vue

  Jan 17 2020   Initial
  Jan 18 2020   Parameters for the user list sent to the userliststore
  Jan 19 2020   Link and zoom on user's details
  Jan 20 2020   Link and zoom on user's details, still some work
  Jan 24 2020   Collapse tests for user details
  Jan 26 2020   User details now includes profilecodes
                Add buttons (collapse, expand...)
  Jan 27 2020   Add a user edit button
  Jan 29 2020   Add a user delete button
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
          <div class="mt-2 mb-2">
            <b-button size="sm" v-on:click="collapseall" variant="primary">Collapse All</b-button>
            <b-button size="sm" v-on:click="expandall" variant="primary">Expand All</b-button>
          </div>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
      <!-- 
        The users dump window 
      -->
      <b-card class="mt-2">
      <div class="mt-2 ml-1 mr-1">
        <div  v-for="(entry, index) in userlist" :key="entry._id"  >
          <b-row class="pl-3 pr-3">
            <b-col class="text-left ml-3" >{{entry.email}}</b-col>
            <b-col class="text-center" >
              <b-link @click="zoomselected(entry)"><img src='../../../assets/search.png'></b-link>
              <b-link @click="edituser(entry)"><img src='../../../assets/edit_profile.png'></b-link>
              <div class="inlineright">
                <b-link @click="deleteuser(entry)"><img src='../../../assets/delete.png'></b-link>
              </div>
            </b-col>
          </b-row>

          <!-- Details -->
          <b-row class="pl-3 pr-3" >
             <b-collapse :id="'userdetails-'+index" v-model="entry.show" >
              <b-card title="User details" 
                  sub-title="Some dates may be unset"
                  class="mt-2 mb-2 ml-3 mr-3"
                >
                  <li>ID          : {{entry._id}}</li>
                  <li>Pseudo      : {{entry.name}}</li>
                  <li>Description : {{entry.description}} </li>
                  <li>Last login  : {{entry.lastlogin | formatdate}}</li>
                  <li>Last logout : {{entry.lastlogout | formatdate}} </li>
                  <li>Created     : {{entry.created | formatdate}}</li>
                  <li>Updated     : {{entry.updated | formatdate}}</li>
                  <li>Privileges  : {{entry.profilecode}}</li>
              </b-card>
             </b-collapse>
          </b-row>
        </div>
      </div>
        
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
const helpers = require('../../core/services/helpers');
const props = require('../../core/services/properties');

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
      return {
        version: "List 1.69, Jan 29 2020 ",
        timeoutsid: null,
      }
  },
  methods: {
    zoomselected(selectedUser) {
      if(selectedUser.show) {
          selectedUser.show = false;
      }
      else {
          selectedUser.show = true; 
      }
      this.$forceUpdate();
    },
    edituser(selectedUser) {
      this.$router.push({ name: 'edit', params: selectedUser });
    },
    collapseall() {
      this.$store.dispatch('userliststore/collapseAll');
      this.$forceUpdate();
    },
    expandall() {
      this.$store.dispatch('userliststore/expandAll');
      this.$forceUpdate();
    },
    deleteuser(selecteduser) {
      this.$router.push( { name: 'deleteme', params: selecteduser });
    },
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
}
</script>
