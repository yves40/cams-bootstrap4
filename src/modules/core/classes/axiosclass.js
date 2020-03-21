//----------------------------------------------------------------------------
//    axiosclass.js
//
//    Mar 21   Initial
//----------------------------------------------------------------------------
const axios = require('axios');

const logger = require("../services/logger");
const properties = require('../services/properties');

module.exports =  class axiosclass {

    // In the constructor, the /mongo/status service is called 
    // for each server defined in the list extracted from properties.nodeservercandidates
    // The idea is to build a list of potential node/express server and flag them
    // as available or not. 
    constructor () 
    {
        this.Version = 'axiosclass:1.04, Mar 21 2020 ';
        this.nodeservers = []; // { nodeserver: status:}
        this.axiosinstance = axios.create({
                timeout: 2000,
                withCredentials: true,
            });
        // Search for potential servers
        const servercandidates =  properties.nodeservercandidates;
        for (let loop = 0; loop < servercandidates.length; ++loop ) {
            this.nodeservers.push({ 'nodeserver':servercandidates[loop].url, 'status': 0 });
            this.checkServer(servercandidates[loop].url).then( (response) => {
              logger.info(response.data.status + ' : ' + response .data.checktime);
              this.nodeservers[loop].status = 1;
            })
            .catch( (error) => {
                this.nodeservers[loop].status = 0;
                logger.error(error);
            })          
        }
    } 
    // Getter
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
    //-----------------------------------------------------------------------------
    // Private functions
    // Check the mongodb connection status for a given server
    // Returns a Promise so when you call it, use the classic caller syntax
    //-----------------------------------------------------------------------------
    checkServer(serverurl) {
        return new Promise( (resolve, reject) => {
          this.axiosinstance(
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
}
  