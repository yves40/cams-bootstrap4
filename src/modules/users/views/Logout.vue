<!--

  Logout.vue
  
  Jan 31 2019   Initial
  Feb 06 2019   Simplify axios   
  Feb 08 2019   axiosutility...
  Mar 15 2019   Test token invalidation after logout. 
                No longer delete it from local storage
                Instead, shorten its expiration time
  Nov 07 2019   cams-Bootstrap4
 
-->
<template>

</template>

<script>

import { mapActions } from 'vuex'

export default {
  data: () => ({
    Version: 'Logout:1.20, Nov 07 2019 ',
  }),
  mounted() {
    this.logout();
  },
  methods: {
    ...mapActions(
      'userstore', {
        logoutVuex: 'logout',
      }
    ),
    // --------------------------------- Logging out  --------------------------------
    logout() {
      this.logoutVuex({router: this.$router, path: this.$route.path})
        .then((result) => {
          this.$swal('You are disconnected!', result, 'success');
          this.$parent.disableMenu('logout');
          this.$parent.enableMenu('login');
          this.$parent.enableMenu('register');
          this.$parent.disableTopMenu('Bootstrap4');
        })
        .catch((err) => {
          this.$swal('KO!', err, 'error');
        });
    },
  },
};
</script>

<style>
  h1 {
    text-align: left;
    font-family: 'Courier New', Courier, monospace;
    font-size: 2em;
  }
  h2 {
    text-align: left;
    color: blue;
    font-size:1em;
  }
</style>
