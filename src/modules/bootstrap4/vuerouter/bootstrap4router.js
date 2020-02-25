//----------------------------------------------------------------------------
//    bootstrap4router.js
//
//    Sep 27 2019   Initial
//    Sep 30 2019   b4test1 added
//    Oct 01 2019   b4test1 is now buttons : Add more views
//    Oct 04 2019   Template view
//    Oct 05 2019   Router structure reorg
//    Feb 25 2020   caps error on Buttons
//----------------------------------------------------------------------------

const Version = "bootstrap4router.js: Feb 25 2020, 1.17 ";

import Vue from "vue";
import Router from "vue-router";

import Buttons from "../views/Buttons";
import Tabs from "../views/Tabs";
import Form from "../views/Form";
import Pagination from "../views/Pagination";
import Template from "../views/Template";


const  bootstrap4routes = 
  [
    { path: "/buttons", name: "buttons", component: Buttons },
    { path: "/tabs", name: "tabs", component: Tabs },
    { path: "/form", name: "form", component: Form },
    { path: "/pagination", name: "pagination", component: Pagination },
    { path: "/template", name: "template", component: Template },
  ];
export default bootstrap4routes;
