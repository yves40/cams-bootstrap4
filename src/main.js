//----------------------------------------------------------------------------
//    main.js
//
//    Sep 30 2019   Initial
//    Oct 05 2019   Reorg routers
//----------------------------------------------------------------------------
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './css/main.css'
import BootstrapVue from 'bootstrap-vue'

import Vue from 'vue';
import App from './App';

import mainrouter from './modules/core/router/mainrouter';


Vue.use(BootstrapVue)

new Vue({
  el: '#app',
  router: mainrouter,
  template: '<App/>',
  components: { App },
  render: h => h(App)
})
