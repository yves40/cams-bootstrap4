//----------------------------------------------------------------------------
//    usersrouter.js
//
//    Oct 05 2019   Initial
//    Nov 05 2019   Add Identity
//    Nov 07 2019   Finally use a logout page...
//----------------------------------------------------------------------------

const Version = "usersrouter.js: Nov 05 2019, 1.01 ";

import Vue from "vue";
import Router from "vue-router";

import Login from "../views/Login.vue";
import Logout from "../views/Logout.vue";
import Register from "../views/Register";
import Identity from "../views/Identity";

const  usersroutes = 
  [
    { path: "/login", name: "login", component: Login },
    { path: "/logout", name: "logout", component: Logout },
    { path: "/register", name: "register", component: Register },
    { path: "/identity", name: "identity", component: Identity },
  ];
export default usersroutes;
