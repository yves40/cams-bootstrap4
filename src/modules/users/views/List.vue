<!--

  List.vue

  Jan 17 2020   Initial
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
      <!-- 
        The users dump window 
      -->
      <div class="viewframe">
        <b-col cols="2"></b-col>
        <b-col cols="2">Here is the user list</b-col>
        <b-col cols="2"></b-col>
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
        version: "List 1.00, Jan 17 2020 ",
      };
  },
  // ------------------------------------------------------------------------------------------------------------
  computed: {
    ...mapGetters (
        'userstore', { 
          userstoreversion:  'getVersion',
        }
    ),
  },  
  
  // ------------------------------------------------------------------------------------------------------------
  created() {
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
