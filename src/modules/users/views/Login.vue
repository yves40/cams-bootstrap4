<!--

  Login.vue

  Sep 28 2019   Initial
  Sep 30 2019   sections & css
  Oct 02 2019   Fix the popup menu problem. Use ready() instead of created()
  Oct 04 2019   Start work to get login implementation
  Oct 05 2019   Actions. Reorg folders
  Oct 11 2019   Add b-container to be bootstrap4 compliant
  Oct 22 2019   Mongodb status
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
              <b-form-group
                id="email"
                label="Your email"
                label-for="email"
                label-cols-sm="3"
                :invalid-feedback="invalidEmail"
                :state="emailstate"
              >
                <b-form-input id="email" v-model="email" :state="emailstate" trim></b-form-input>
              </b-form-group>
              <b-form-group
                id="password"
                label="Password"
                label-for="password"
                label-cols-sm="3"
                :state="passwordstate"
              >
                <b-form-input id="password" v-model="password" :state="passwordstate" trim></b-form-input>
              </b-form-group>

              <b-form-group
                label-cols-sm="3"
              >
                <b-button :disabled="checkall" v-on:click="login">Login</b-button>
                <b-button  v-on:click="clear">Clear</b-button>
                <b-button  v-bind:to="{ name: 'home' }">Cancel</b-button>
              </b-form-group>
              <b-form-group label-cols-sm="3">
                <b-link  v-bind:to="{ name: 'register' }">New to the site ? Register</b-link>
              </b-form-group>
          </div>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

const logger = require('../../core/services/logger');
const axios = require('../../core/services/axios');

export default {
  data() {
      return {
        version: "Login 1.36, Oct 22 2019 ",
        email: '',
        password: '',
        mongostatus: false,
        axiosinstance: null,
      };
  },
  computed: {
      emailstate() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.email.toLowerCase());
      },
      passwordstate () {
        return (this.password.length >= 8 ) ? true : false;
      },
      invalidEmail() {
          return ''
      },
      validEmail() {
        return this.emailstate === true ? 'Mail format OK': ''
      },
      checkall() {
        return ! ((this.emailstate && this.passwordstate));
      }
  },  
  created() {
    this.$parent.disableMe('login');
  },
  mounted() {
    this.axiosinstance = axios.getAxios();
    logger.debug(this.version + 'Polling mongostatus from ' + axios.getNodeserver());
    this.axiosinstance(
      {
          url: '/mongo/mongostatus',
          method: 'get',
      },
    )
    .then((response) => {
      logger.debug('Axios call done : mongo status is ' + response.data.status);
      },
    )
    .catch((error) => {
      logger.error('Axios call done : Error received');
      console.log(error);
      },
    );
  },
  beforeDestroy() {
    this.$parent.enableMe('login');
  },
  methods: {
    login() {
      logger.debug(this.version + 'login requested');
    },
    clear() {
      this.email = this.password = '';
    },
  }
};
</script>
