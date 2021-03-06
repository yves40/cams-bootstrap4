//----------------------------------------------------------------------------
//    mainrouter.js
//
//    Oct 05 2019   Initial : core router 
//    Oct 09 2019   About
//    Oct 16 2019   Reorg folders : router becomes vuerouter
//----------------------------------------------------------------------------

const Version = "mainrouter.js: Oct 16 2019, 1.21 ";

import Vue from "vue";
import Router from "vue-router";

import Home from "../views/Home";
import About from "../views/About";
// Additional routes for the template
import bootstrap4routes from '../../bootstrap4/vuerouter/bootstrap4router';
import usersroutes from '../../users/vuerouter/usersrouter';

Vue.use(Router);

const  mainroutes = 
  [
    { path: "/", name: "/", component: Home },
    { path: "/home", name: "home", component: Home },
    { path: "/about", name: "about", component: About },
  ];


let mainrouter = new Router();
mainrouter.addRoutes(mainroutes);
mainrouter.addRoutes(bootstrap4routes);
mainrouter.addRoutes(usersroutes);

export default mainrouter;
