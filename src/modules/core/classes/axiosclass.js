//----------------------------------------------------------------------------
//    axiosclass.js
//
//    Mar 21   Initial
//    Mar 22   More methods
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
        this.Version = 'axiosclass:1.08, Mar 22 2020 ';
        this.nodeservers = []; // { nodeserver: status:}
        this.selectedserver = null;
        // Search for potential servers
        // the selectedserver will be the last in the list which is active
        const servercandidates =  properties.nodeservercandidates;
        for (let loop = 0; loop < servercandidates.length; ++loop ) {
            this.nodeservers.push({ 'nodeserver':servercandidates[loop].url, 'status': 0 });
            checkServer(servercandidates[loop].url).then( (response) => {
              logger.debug(servercandidates[loop].url + ' : ' + response.data.status + ' : ' + response .data.checktime);
              this.nodeservers[loop].status = 1;
              this.selectedserver = servercandidates[loop].url;
            })
            .catch( (error) => {
                this.nodeservers[loop].status = 0;
                logger.error(servercandidates[loop].url + ' : ' + error);
            })          
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
    // Simple get request : The URL does not include the server and port
    // It'll be automatically concatenated
    get(url) {
      return new Promise( (resolve, reject) => {
        axiosinstance(
          {
              baseURL: this.selectedserver,
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
  