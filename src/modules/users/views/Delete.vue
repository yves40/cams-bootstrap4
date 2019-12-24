<!--

  Delete.vue

  Dec 20 2019   Initial
  Dec 21 2019   Use swal from bootstrap-sweetalert
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
      <b-col>
        <p><b>{{email}}</b> with pseudo {{name}}, known as : {{description}}</p>
      </b-col>
      <b-col cols="2"></b-col>
    </b-row>

    <b-row>
      <b-col cols="2"></b-col>
      <b-col>
        <p>Delete your account now ? </p>
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
      version: "Delete 1.08, Dec 20 2019",
    };
  },
  computed: {
    ...mapGetters (
        'userstore', { 
          email: 'getEmail',
          name: 'getName',
          description: 'getDescription',
        }
    ),
  },  
 
 created() {
    this.$parent.disableMenu('deleteme');
  },
  beforeDestroy() {
    this.$parent.enableMenu('deleteme');
  },
  methods: {
    // Some funny things with swal
    deleteme() {
      swal({
        title: "Are you sure?",
        text: "Your will not be able to recover your account!",
        icon: "warning",
        dangerMode: true,
        buttons:{
          forget: {
            text: "Forget it",
            value: "forget",
            visible: true,
          },
          cancel: {
            text: "Back to identity",
            value: "abort",
            visible: true,
          },
          confirm: {
            text: "Shoot me!!!",
            value: "shoot",
            visible: true,
          },
        },
      })
      .then( (choice) => {
        switch(choice) {
          case "forget": 
            this.$router.push({ name: 'home' });
            break;
          case "abort": 
            this.$router.push({ name: 'identity' });
            break;
          case "shoot": 
            this.$store.commit('userstore/delete');
            this.$router.push({ name: 'logout', params: { mode: 'afterdelete'} });
            break;
        }
      })
    },
    gotohome() {
      this.$router.push({ name: 'home' });
    },
  }
};
</script>
