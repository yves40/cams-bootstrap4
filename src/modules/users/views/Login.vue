<!--

  Login.vue

  Sep 28 2019   Initial
  Sep 30 2019   sections & css
  Oct 02 2019   Fix the popup menu problem. Use ready() instead of created()
  Oct 04 2019   Start work to get login implementation
  Oct 05 2019   Actions. Reorg folders
  Oct 11 2019   Add b-container to be bootstrap4 compliant
  Oct 22 2019   Mongodb status
  Oct 23 2019   Change mongodb status checking : use Vuex with mongostore
  Oct 25 2019   Fix button overlap problem when resizing to small window
  Oct 27 2019   Buttons positions when window resized to minimum
  Oct 31 2019   Install the login handler now and test
  Nov 02 2019   Start Vuex integration, with userstore
  Nov 03 2019   More tests with Vuex. 
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

              <div>
                <b-navbar toggleable="sm">
                  <b-navbar-toggle target="collapsemenu"></b-navbar-toggle>
                  <b-collapse id=collapsemenu is-nav>
                    <b-navbar-nav class="mr-auto">
                        <b-button pill :disabled="checkall" v-on:click="login">Login</b-button>
                        <b-button pill v-on:click="clear">Clear</b-button>
                        <!-- Have to route through a method call to avoid button oversizing -->
                        <b-button pill  variant="danger" v-on:click="gotohome" >Cancel</b-button>
                    </b-navbar-nav>
                  </b-collapse>
                </b-navbar>
              </div>

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
const axiosinstance = require('../../core/services/axios').getAxios();

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
      return {
        version: "Login 1.79, Nov 03 2019 ",
        email: '',
        password: '',
      };
  },
  computed: {
      emailstate() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.email.toLowerCase());
      },
      passwordstate () {
        return (this.password.length >= 6 ) ? true : false;
      },
      invalidEmail() {
          return ''
      },
      validEmail() {
        return this.emailstate === true ? 'Mail format OK': ''
      },
      checkall() {
        const mongodown = this.$store.getters['mongostore/IsMongoDown'];
        return ! (this.emailstate && this.passwordstate && !mongodown);
      },
    ...mapGetters (
        'mongostore', { 
            MongoDown:  'IsMongoDown',
        },
    ),
  },  
  created() {
    this.$parent.disableMe('login');
  },
  beforeDestroy() {
    this.$parent.enableMe('login');
  },
  methods: {
    ...mapActions (
      'userstore', {
        loginVuex: 'login'
      }
    ),
    login() {
      logger.debug(this.version + 'login requested');
      this.loginVuex({email: this.email, password: this.password, router: this.$router})
      .then((result) => {
        this.$swal('OK!', result, 'success');
      })
      .catch((err) => {
        this.$swal('KO!', err, 'error');
      });
    },
    clear() {
      this.email = this.password = '';
    },
    gotohome() {
      this.$router.push({ name: 'home' });
    },
  }
};
</script>
