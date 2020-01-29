<!--

  Edit.vue

  Dec 17 2019   Initial
  Dec 19 2019   Fix description of user not transmitted to the store call
  Jan 26 2020   Work on user modification by an admin
  Jan 27 2020   Work on user modification by an admin; Now get the modified user
  Jan 28 2020   Fix some binding
  Jan 29 2020   Add a parameter for update call to the user store
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

    <b-row class="pb-2">
      <b-col cols="2"></b-col>
      <b-col cols="4">
        <span>Editing : <strong>{{targetuser.email}}</strong></span>
      </b-col>
      <b-col>
        <div v-if="!selfedit">
          <b-button @click="backtolist">Back to list</b-button>
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="2"></b-col>
      <b-col >
        <div >
            <b-form-group
              id="name"
              label="Your pseudo"
              label-for="name"
              label-cols-sm="3"
              :invalid-feedback="invalidName"
              :valid-feedback="validName"
              :state="namestate"
            >
              <b-form-input id="name" v-model="targetuser.name" :state="namestate" trim></b-form-input>
            </b-form-group>

            <b-form-group
              id="description"
              description="Who are you ? 10 to 40 characters."
              label="Description"
              label-for="description"
              label-cols-sm="3"
              :state="descstate"
            >
              <b-form-input id="description" v-model="targetuser.description" :state="descstate" trim></b-form-input>
            </b-form-group>

            <!-- The user privilege management section -->
            <div v-if="isadmin">
              <b-form-checkbox-group id="userprivs" v-model="privileges" 
                :options="profilecodes"
                stacked>
              </b-form-checkbox-group>
            </div>
            <strong>{{ privileges }}</strong>

            <div>
              <b-navbar toggleable="sm">
                <b-navbar-toggle target="collapsemenu"></b-navbar-toggle>
                <b-collapse id="collapsemenu" is-nav>
                  <b-navbar-nav class="mr-auto">
                    <b-button pill :disabled="checkall" v-on:click="update">Update</b-button>
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

const logger = require('../../core/services/logger');
const profileclass = require('../classes/profileclass');

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      version: "Edit 1.30, Jan 29 2020 ",
      isadmin: false,
      privileges: [ 'STD '],
      profilecodes: [],
      userprofiles: [],
      targetuser: null,
      selfedit: true,
    };
  },
  computed: {
    ...mapGetters (
        'userstore', { 
          logged: 'isLogged'
        }
    ),
    name: {
      get() {
        return this.targetuser.name;
      },
      set(value) {
        this.targetuser.name = value;
      },
    },
    userdescription: {
      get() {
        return this.targetuser.description;
      },
      set(value) {
        this.targetuser.description = value;
      },
    },
    namestate() {
      return this.targetuser.name.length >= 5 ? true : false
    },
    invalidName() {
      if (this.targetuser.name.length >= 5) {
        return ''
      } else if (this.targetuser.name.length > 0) {
        return 'Enter at least 5 characters'
      } else {
        return 'Please enter your pseudo'
      }
    },
    validName() {
      return this.namestate === true ? 'Thank you' : ''
    }, 
    descstate() {
      return (this.targetuser.description.length >= 10 && this.targetuser.description.length <= 40) ? true : false
    },
    checkall() {
      const mongodown = this.$store.getters['mongostore/IsMongoDown'];
      return ! ((this.namestate && this.descstate && !mongodown));
    },
    ...mapGetters (
        'mongostore', { 
            MongoDown:  'IsMongoDown',
        },
    ),
  },  
  created() {
    this.$parent.disableMenu('edit');
    this.isadmin = this.$store.getters['userstore/isUserAdmin']
    logger.debug(this.version + ' Admin ? ' + (this.isadmin ? 'YES' : 'NO'));
    if(this.isadmin) {
      let pc = new profileclass();
      this.profilecodes = pc.getProfileLabels()   // These are the standard profiles
    }
    // Is it a user self editing it's profie or an admin editing another user ?
    if ( this.$route.params.email !== undefined) {
      this.selfedit = false;
      this.targetuser = this.$route.params;
      this.privileges = this.targetuser.profilecode;
    }
    else {
      this.targetuser = this.$store.state.userstore.loggeduser.model
      this.privileges = this.$store.state.userstore.loggeduser.model.profilecode;
    }
    console.log(JSON.stringify(this.targetuser));
  },
  beforeDestroy() {
    this.$parent.enableMenu('edit');
  },
  methods: {
    ...mapActions (
      'userstore', {
        updateVuex: 'update'
      }
    ),
    update() {
      this.updateVuex({
          email: this.targetuser.email,
          name: this.targetuser.name,
          description: this.targetuser.description,
          privs: this.privileges,
          updatemode: this.selfedit,
        })
        .then((result) => {
          swal('User ' + this.targetuser.email + ' updated', result, 'success');
          if ( this.selfedit)
            this.$router.push({ name: 'identity' });
          else
            this.$router.push({ name: 'listusers' });
        })
        .catch((err) => {
          swal('KO!', err, 'error');
        });
    },
    clear() {
      this.targetuser.name = '';
      this.targetuser.description = '';
      this.targetuser.profilecode = [ 'STD '];
    },
    gotohome() {
      this.$router.push({ name: 'home' });
    },
    backtolist() {
      this.$router.push({ name: 'listusers' });
    },
  }
};
</script>
