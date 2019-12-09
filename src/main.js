//----------------------------------------------------------------------------
//    main.js
//
//    Sep 30 2019   Initial
//    Oct 05 2019   Reorg routers
//    Oct 06 2019   1st vuex tests
//    Oct 16 2019   Reorg folders : router becomes vuerouter
//    Nov 03 2019   vueswal for informational popups
//    Dec 09 2019   Test vue filter
//----------------------------------------------------------------------------
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './css/main.css'
import BootstrapVue from 'bootstrap-vue'
import vueswal from 'vue-swal'

import Vue from 'vue';
import App from './App';

import mainrouter from './modules/core/vuerouter/mainrouter';
import store from './modules/core/store/store';
import datetime from './modules/core/services/datetime'

const Version = 'Version:1.09, Dec 09 2019';

Vue.use(BootstrapVue);
Vue.use(vueswal);   // For smart alert popups
// Add a vue filter to be used in Identity.vue
Vue.filter('formatdate', function(value) {
  return datetime.convertDateTime(value);
})

new Vue({
  el: '#app',
  router: mainrouter,
  store: store,
  template: '<App/>',
  components: { App },
  render: h => h(App)
})
