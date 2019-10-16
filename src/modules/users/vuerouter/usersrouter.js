//----------------------------------------------------------------------------
//    usersrouter.js
//
//    Oct 05 2019   Initial
//----------------------------------------------------------------------------

const Version = "usersrouter.js: Oct 05 2019, 1.00 ";

import Vue from "vue";
import Router from "vue-router";

import Login from "../views/Login.vue";
import Register from "../views/Register";

const  usersroutes = 
  [
    { path: "/login", name: "login", component: Login },
    { path: "/register", name: "register", component: Register },
  ];
export default usersroutes;
