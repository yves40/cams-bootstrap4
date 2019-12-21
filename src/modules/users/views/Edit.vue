<!--

  Edit.vue

  Dec 17 2019   Initial
  Dec 19 2019   Fix description of user not transmitted to the store call
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
              id="description"
              description="Who are you ? 10 to 40 characters."
              label="Description"
              label-for="description"
              label-cols-sm="3"
              :state="descstate"
            >
              <b-form-input id="description" v-model="userdescription" :state="descstate" trim></b-form-input>
            </b-form-group>

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
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      version: "Edit 1.11, Dec 19 2019",
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
        return this.$store.state.userstore.theuser.model.name;
      },
      set(value) {
        this.$store.state.userstore.theuser.model.name = value;
      },
    },
    userdescription: {
      get() {
        return this.$store.state.userstore.theuser.model.description;
      },
      set(value) {
        this.$store.state.userstore.theuser.model.description = value;
      },
    },
    namestate() {
      return this.$store.state.userstore.theuser.model.name.length >= 5 ? true : false
    },
    invalidName() {
      if (this.$store.state.userstore.theuser.model.name.length >= 5) {
        return ''
      } else if (this.$store.state.userstore.theuser.model.name.length > 0) {
        return 'Enter at least 5 characters'
      } else {
        return 'Please enter your pseudo'
      }
    },
    validName() {
      return this.namestate === true ? 'Thank you' : ''
    }, 
    descstate() {
      return (this.$store.state.userstore.theuser.model.description.length >= 10 && this.$store.state.userstore.theuser.model.description.length <= 40) ? true : false
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
          name: this.name,
          description: this.userdescription,
        })
        .then((result) => {
          swal('User ' + this.$store.state.userstore.theuser.model.email + ' updated', result, 'success');
          this.$router.push({ name: 'identity' });
        })
        .catch((err) => {
          swal('KO!', err, 'error');
        });
    },
    clear() {
      this.$store.state.userstore.theuser.model.name = '';
      this.$store.state.userstore.theuser.model.description = '';
    },
    gotohome() {
      this.$router.push({ name: 'home' });
    },
  }
};
</script>
