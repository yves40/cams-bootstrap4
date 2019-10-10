<!--

  About.vue

  Sep 28 2019   Initial
  Oct 02 2019   Fix the popup menu problem. Use ready() instead of created()
  Oct 03 2019   Grid setup
  Oct 04 2019   Some info
  Oct 05 2019   Reorg
  Oct 06 2019   1st vuex tests
-->
<template>
  <div>
      <b-container>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <img src="../../../assets/WIP.png" />
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <b-list-group >
              <b-list-group-item>{{version}}</b-list-group-item>
              <b-list-group-item>{{coreversion}}</b-list-group-item>
              <b-list-group-item>{{userversion}}</b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
      </b-container>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters (
        'userstore', {userversion: 'getVersion'}
      ),
    ...mapGetters (
        'corestore', {coreversion: 'getVersion',
                      today: 'getToday'
        },
      )
  },
  data() {
    return {
      version: "About 1.02, Oct 09 2019"
    };
  },
  created() {
    this.$parent.enableMe('about');
  },
  beforeDestroy() {
    this.$parent.enableMe('about');
  },
};
</script>
