<!--

  Notyet.vue

  Jan 02 2020   Initial
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
            </b-list-group>
          </b-col>
          <b-col cols="2"></b-col>
        </b-row>
        <b-row>
          <b-col cols="2"></b-col>
          <b-col>
            <p></p> 
            <p> This feature is not yet implemented.</p>
            <p></p> 
            <p>We're working hard to bring it online asap</p> 
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

  },
  data() {
    return {
      version: "Notyet 1.00, Jan 02 2020"
    };
  },
};
</script>
