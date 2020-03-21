//----------------------------------------------------------------------------
//    axiosclass.js
//
//    Mar 21   Initial
//----------------------------------------------------------------------------
const axios = require('axios');

const logger = require("../services/logger");
const properties = require('../services/properties');

module.exports =  class axiosclass {

    constructor () 
    {
        this.Version = 'axiosclass:1.02, Mar 21 2020 ';
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
    getNodeServers() {
        return this.nodeservers;
    }
    //-----------------------------------------------------------------------------
    // Private functions
    // Check the mongodb connection status for a given server
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
  