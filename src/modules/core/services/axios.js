//----------------------------------------------------------------------------
//    axiosutility.js
//
//    Feb 06 2019   Initial
//    Oct 22 2019   Project camms-bootstrap
//                  Used to set the base URL into axios
//----------------------------------------------------------------------------
const axios = require('axios');
const nodeserver = require('./properties').nodeserver;

const Version = 'axiosutility:1.13, Oct 22 2019';

function getAxios() {
  return axios.create({
    baseURL: nodeserver,
    timeout: 1000,
    withCredentials: true,
  });  
}

function getNodeserver() {
  return nodeserver;
}
function getVersion() {
  return Version;
};

module.exports = {
  getAxios: getAxios,
  getVersion: getVersion,
  getNodeserver: getNodeserver,
}