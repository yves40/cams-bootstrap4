<!--

  Delete.vue

  Dec 20 2019   Initial
-->
<template>
  <div>
    <b-container>
    <b-row>
      <b-col cols="2"></b-col>
      <b-col>
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
      <b-col >
        <div >
            <div>
              <b-navbar toggleable="sm">
                <b-navbar-toggle target="collapsemenu"></b-navbar-toggle>
                <b-collapse id="collapsemenu" is-nav>
                  <b-navbar-nav class="mr-auto">
                    <b-button pill variant="danger"  v-on:click="deleteme">Delete Me</b-button>
                    <b-button pill variant="primary" v-on:click="gotohome">Cancel</b-button>
                  </b-navbar-nav>
                </b-collapse>
              </b-navbar>
            </div>
        </div>
      </b-col>
      <b-col cols="2"></b-col>
    </b-row>
    </b-container>
  </div>
</template>

<script>

const logger = require('../../core/services/logger');
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      version: "Delete 1.00, Dec 20 2019",
    };
  },
  computed: {
  },  
 
 created() {
    this.$parent.disableMenu('deleteme');
  },
  beforeDestroy() {
    this.$parent.enableMenu('deleteme');
  },
  methods: {
    deleteme() {
      this.$router.push({ name: 'deleteme' });
    },
    gotohome() {
      this.$router.push({ name: 'home' });
    },
  }
};
</script>
