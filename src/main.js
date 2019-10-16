//----------------------------------------------------------------------------
//    main.js
//
//    Sep 30 2019   Initial
//    Oct 05 2019   Reorg routers
//    Oct 06 2019   1st vuex tests
//    Oct 16 2019   Reorg folders : router becomes vuerouter
//----------------------------------------------------------------------------
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './css/main.css'
import BootstrapVue from 'bootstrap-vue'

import Vue from 'vue';
import App from './App';

import mainrouter from './modules/core/vuerouter/mainrouter';
import store from './modules/core/store/store';

const Version = 'Version:1.06, Oct 16 2019';

Vue.use(BootstrapVue);

new Vue({
  el: '#app',
  router: mainrouter,
  store: store,
  template: '<App/>',
  components: { App },
  render: h => h(App)
})
