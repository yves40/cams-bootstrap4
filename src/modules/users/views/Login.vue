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
  Nov 03 2019   More tests with Vuex. Use promise, and externalize the axios call in vues store module 
  Nov 06 2019   Change menu management for login/logout/register...
  Nov 08 2019   Default user mail, will be of course removed later
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
// ------------------------------------------------------------------------------------------------------------
// The script
// ------------------------------------------------------------------------------------------------------------
const logger = require('../../core/services/logger');

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
      return {
        version: "Login 1.82, Nov 08 2019 ",
        email: 'yves@free.fr',
        password: 'manager',
      };
  },
  // ------------------------------------------------------------------------------------------------------------
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
  // ------------------------------------------------------------------------------------------------------------
  created() {
    this.$parent.disableMenu('login');
  },
  beforeDestroy() {
    this.$parent.enableMenu('login');
  },
  // ------------------------------------------------------------------------------------------------------------
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
          this.$parent.disableMenu('login');
          this.$parent.disableMenu('register');
          this.$parent.enableMenu('logout');
          this.$parent.enableTopMenu('Bootstrap4');
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
