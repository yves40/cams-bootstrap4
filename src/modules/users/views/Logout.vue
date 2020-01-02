<!--

  Logout.vue
  
  Jan 31 2019   Initial
  Feb 06 2019   Simplify axios   
  Feb 08 2019   axiosutility...
  Mar 15 2019   Test token invalidation after logout. 
                No longer delete it from local storage
                Instead, shorten its expiration time
  Nov 07 2019   cams-Bootstrap4
  Nov 29 2019   Identiy menu entry
  Dec 17 2019   Edit user profile page de-activated
  Jan 02 2020   New top menu management @ logout
 
-->
<template>

</template>

<script>

import { mapActions } from 'vuex'

export default {
  data: () => ({
    Version: 'Logout:1.23, Jan 02 2020 ',
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
      // If logout is called after a delete user (by himself) pass the parameter to the logout method
      // as setting the logout time is no longer possible
      let logoutmode = 'standard';
      if ( this.$route.params.mode !== undefined)
        logoutmode = this.$route.params.mode;
      this.logoutVuex({router: this.$router, path: this.$route.path, mode: logoutmode})
        .then((result) => {
          swal('You are disconnected!', result, 'success');
          this.$parent.setupMenus('logout');
        })
        .catch((err) => {
          swal('KO!', err, 'error');
        });
    },
  },
};
</script>
