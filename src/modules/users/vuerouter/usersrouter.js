//----------------------------------------------------------------------------
//    usersrouter.js
//
//    Oct 05 2019   Initial
//    Nov 05 2019   Add Identity
//----------------------------------------------------------------------------

const Version = "usersrouter.js: Nov 05 2019, 1.01 ";

import Vue from "vue";
import Router from "vue-router";

import Login from "../views/Login.vue";
import Register from "../views/Register";
import Identity from "../views/Identity";

const  usersroutes = 
  [
    { path: "/login", name: "login", component: Login },
    { path: "/register", name: "register", component: Register },
    { path: "/identity", name: "identity", component: Identity },
  ];
export default usersroutes;
