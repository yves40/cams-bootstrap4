//----------------------------------------------------------------------------
//    profileclass.js
//
//    Dec 202019   Initial
//----------------------------------------------------------------------------

module.exports = class profileclass {

  constructor () 
  {
      this.Version = 'profileclass:1.00, Dec 20 2019 ';
      this.profiles = [ 
        { code: 0, key: 'STD', label: 'Standard user' }, 
        { code: 50, key: 'USERADMIN', label: 'User administrator' }, 
        { code: 10, key: 'CAMADMIN', label: 'Camera administrator' }, 
        { code: 100, key: 'SUPERADMIN', label: 'Super administrator' }, 
      ]

  } 

  // Getter
  getProfileKeys() {

  }
  getProfileLabels() {

  }
  getProfileLabel(labelcode) {

  }
  //-----------------------------------------------------------------------------------
  // get a profile label
  //-----------------------------------------------------------------------------------
  getProfileLabel(profkey) {
    for(let i = 0; i < this.profiles.length; ++i) {
      if(this.profiles[i].key === profkey) 
        return this.profiles[i].label;
    }
    return 'Unknown profile';
  }
}
