<!--

  List.vue

  Jan 17 2020   Initial
  Jan 18 2020   Parameters for the user list sent to the userliststore
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
        <b-col cols="8">{{storeversion}}</b-col>
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
      <div class="mt-2">
        <div class="viewframe" v-for="entry in userlist" :key="entry._id" >
          <b-row>
            <b-col>{{entry.email}} - {{entry.name}}</b-col>
            <b-col cols="8">{{entry.description}}</b-col>
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

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
      return {
        version: "List 1.14, Jan 18 2020 ",
      }
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
          this.$store.dispatch('userliststore/loadUsersList',  value );
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
