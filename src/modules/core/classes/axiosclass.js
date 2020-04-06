//----------------------------------------------------------------------------
//    axiosclass.js
//
//    Mar 21 2020   Initial
//    Mar 22 2020   More methods
//    Mar 25 2020   Add info to the properties and exploit them
//    Mar 27 2020   Work on post and get with params
//    Apr 06 2020   Constructor now receives the web host name
//----------------------------------------------------------------------------
const axios = require('axios');

const logger = require("../services/logger");
const properties = require('../services/properties');

//-----------------------------------------------------------------------------
// Private functions
// Check the mongodb connection status for a given server
// Returns a Promise so when you call it, use the classic caller syntax
//-----------------------------------------------------------------------------
const axiosinstance = axios.create({
  timeout: 2000,
  withCredentials: true,
});

function checkServer(serverurl) {
  return new Promise( (resolve, reject) => {
    axiosinstance(
      {
          baseURL: serverurl,
          url: '/mongo/status',
          method: 'get',
      }
    ).then( (response) => {
      resolve(response);  // Response is a promise
    })
    .catch( (error)  => {
      reject(error);
    })
  })
}

//-----------------------------------------------------------------------------
// axios class with some logic
//-----------------------------------------------------------------------------
module.exports =  class axiosclass {

    // In the constructor, the /mongo/status service is called 
    // for each server defined in the list extracted from properties.nodeservercandidates
    // The idea is to build a list of potential node/express server and flag them
    // as available or not. 
    constructor (preferredserver = null) 
    {
        this.Version = 'axiosclass:1.19, Apr 06 2020 ';
        this.nodeservers = []; // { nodeserver: status:}
        this.selectedserver = null;
        this.selectedservername = null;
        const servercandidates =  properties.nodeservercandidates;
        if (preferredserver) {
          for (let loop = 0; loop < servercandidates.length; ++loop ) {
            if(servercandidates[loop].url.split(':')[1].substr(2) === preferredserver) {
              logger.debug(this.Version + 'Selected nodeJS server : ' + servercandidates[loop].url);
              this.nodeservers.push({ 'nodeserver':servercandidates[loop].url, 'name': servercandidates[loop].name, 'status': 1 });
              this.selectedserver = servercandidates[loop].url;
              this.selectedservername = servercandidates[loop].name;
              break;
            }
          }
        }
        else {    // Should never go here
          // Search for potential servers
          // the selectedserver will be the last in the list which is active
          for (let loop = 0; loop < servercandidates.length; ++loop ) {
              this.nodeservers.push({ 'nodeserver':servercandidates[loop].url, 'name': '', 'status': 0 });
              checkServer(servercandidates[loop].url).then( (response) => {
                logger.debug(servercandidates[loop].url + ' : ' + response.data.status + ' : ' + response .data.checktime);
                this.nodeservers[loop].status = 1;
                this.nodeservers[loop].name = servercandidates[loop].name;
                this.selectedserver = servercandidates[loop].url;
                this.selectedservername = servercandidates[loop].name;
              })
              .catch( (error) => {
                  this.nodeservers[loop].status = 0;
                  logger.error(servercandidates[loop].url + ' : ' + error);
              })          
          }  
        }
    } 
    //------------------------------------------------------------------------
    // Getters
    //------------------------------------------------------------------------
    getVersion() {
        return this.Version;
    }
    // Returns an array of potential servers and their status
    getNodeServers() {
        return this.nodeservers;
    }
    // Returns one usable node server
    // If none, returns a null
    getLastActiveNode() {
      let servercode = null;
      this.nodeservers.forEach( (node) => {
        if(node.status === 1) servercode = node.nodeserver;
      });
      return servercode;
    }
    // Returns the first usable node server
    // If none, returns a null
    getFirstActiveNode() {
      let servercode = null;
      for(let loop = 0; loop < this.nodeservers.length; ++loop) {
        if(this.nodeservers[loop].status === 1) { 
          servercode = this.nodeservers[loop].nodeserver;
          break;
        }
      };
      return servercode;
    }
    // Returns the selected server 
    getSelectedServer() {
      return this.selectedserver === null ? 'None': this.selectedserver;
    }
    // Returns the selected server 
    getSelectedServerName() {
      return this.selectedservername === null ? 'None': this.selectedservername;
    }
    //----------------------------------------------------------------------------------------
    // get request : The URL does not include the server and port
    // It'll be automatically concatenated
    //----------------------------------------------------------------------------------------
    get(url, data = null, headers = null) {
      return new Promise( (resolve, reject) => {
        let params = {
          baseURL: this.selectedserver,
          url: url,
          method: 'get',
        }
        if(data) params.params = data;
        if(headers) params.headers = headers;
        axiosinstance(
          params
        ).then( (response) => {
          resolve(response);
        })
        .catch((error)  => {
          reject(error);
        })
      });      
    }
    //----------------------------------------------------------------------------------------
    // post request : The URL does not include the server and port
    // It'll be automatically concatenated
    //----------------------------------------------------------------------------------------
    post(url, data = null, headers = null) {
      return new Promise( (resolve, reject) => {
        let params = {
          baseURL: this.selectedserver,
          url: url,
          method: 'post',
        }
        if(data) params.data = data;
        if(headers) params.headers = headers;
        axiosinstance(
          params
        ).then( (response) => {
          resolve(response);
        })
        .catch((error)  => {
          reject(error);
        })
      });      
    }
    // Simple get request
    getFull(url) {
      return new Promise( (resolve, reject) => {
        axiosinstance(
          {
              url: url,
              method: 'get',
          }
        ).then( (response) => {
          resolve(response);
        })
        .catch((error)  => {
          reject(error);
        })
      });      
    }
    //------------------------------------------------------------------------
    // Callers
    //------------------------------------------------------------------------
  }
  