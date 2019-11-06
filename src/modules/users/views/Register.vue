<!--

  Register.vue

  Oct 01 2019   Initial
  Oct 02 2019   Fix the popup menu problem. Use ready() instead of created()
  Oct 04 2019   Start work to get register implementation
  Oct 05 2019   Add buttons, handle requests, reorg folders
  Oct 11 2019   Add b-container to be bootstrap4 compliant
  Oct 25 2019   Fix button overlap problem when resizing to small window
                Manage mongodb down detection as in login vue
  Oct 31 2019   Fix button overlap problem when resizing to small window-->
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
              description="Will be used for login."
              label="Enter your email"
              label-for="email"
              label-cols-sm="3"
              :invalid-feedback="invalidEmail"
              :state="emailstate"
            >
              <b-form-input id="email" v-model="email" :state="emailstate" trim></b-form-input>
            </b-form-group>

            <b-form-group
              id="password1"
              description="Your password. At least 8 characters please"
              label="Password"
              label-for="password1"
              label-cols-sm="3"
              :state="password1state"
            >
              <b-form-input id="password1" v-model="password1" :state="password1state" trim></b-form-input>
            </b-form-group>

            <b-form-group
              id="password2"
              description="Password verification"
              label="Password Verification"
              label-for="password2"
              label-cols-sm="3"
              :state="password2state"
            >
              <b-form-input type="password" id="password2" v-model="password2" :state="password2state" trim></b-form-input>
            </b-form-group>

            <b-form-group
              id="name"
              label="Your pseudo"
              label-for="name"
              label-cols-sm="3"
              :invalid-feedback="invalidName"
              :valid-feedback="validName"
              :state="namestate"
            >
              <b-form-input id="name" v-model="name" :state="namestate" trim></b-form-input>
            </b-form-group>

            <b-form-group
              id="userdescription"
              description="Who are you ? 10 to 40 characters."
              label="Description"
              label-for="userdescription"
              label-cols-sm="3"
              :state="descstate"
            >
              <b-form-input id="userdescription" v-model="userdescription" :state="descstate" trim></b-form-input>
            </b-form-group>

            <div>
              <b-navbar toggleable="sm">
                <b-navbar-toggle target="collapsemenu"></b-navbar-toggle>
                <b-collapse id="collapsemenu" is-nav>
                  <b-navbar-nav class="mr-auto">
                    <b-button pill :disabled="checkall" v-on:click="register">Register</b-button>
                    <b-button pill  v-on:click="clear">Clear</b-button>
                    <b-button pill variant="danger" v-on:click="gotohome">Cancel</b-button>
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

const Logger = require('../../core/services/logger');
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      version: "Register 1.27, Oct 31 2019",
      name: '',
      email: '',
      userdescription: '',
      password1: '',
      password2: '',
    };
  },
  computed: {
      namestate() {
        return this.name.length >= 5 ? true : false
      },
      invalidName() {
        if (this.name.length >= 5) {
          return ''
        } else if (this.name.length > 0) {
          return 'Enter at least 5 characters'
        } else {
          return 'Please enter your pseudo'
        }
      },
      validName() {
        return this.namestate === true ? 'Thank you' : ''
      }, 
      emailstate() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.email.toLowerCase());
      },
      invalidEmail() {
          return this.emailstate === false ? 'Invalid mail format: should be xxxxx@dom.cc' : ''
      },
      validEmail() {
        return this.emailstate === true ? 'Mail format OK': 'Enter a valid email please'
      },
      descstate() {
        return (this.userdescription.length >= 10 && this.userdescription.length <= 40) ? true : false
      },
      password1state() {
        return (this.password1.length >= 8 ) ? true : false
      },
      password2state() {
        return (this.password1 === this.password2 )&&( this.password1.length > 0) ? true : false
      },
      checkall() {
        const mongodown = this.$store.getters['mongostore/IsMongoDown'];
        return ! ((this.namestate && this.emailstate && this.descstate && this.password1state
         && this.password2state && !mongodown));
      },
      ...mapGetters (
          'mongostore', { 
              MongoDown:  'IsMongoDown',
          },
      ),
  },  
  created() {
    this.$parent.disableMenu('register');
  },
  beforeDestroy() {
    this.$parent.enableMenu('register');
  },
  methods: {
    register() {
      Logger.info('Requesting registration of ' + this.name); 
    },
    clear() {
      this.name = this.userdescription = this.email = this.password1 = this.password2 = '';
    },
    gotohome() {
      this.$router.push({ name: 'home' });
    },
  }
};
</script>
