//----------------------------------------------------------------------------
//    profileclass.js
//
//    Dec 20 2019   Initial
//    Jan 25 2020   Implement some methodes
//----------------------------------------------------------------------------

module.exports =  class profileclass {

  constructor () 
  {
      this.Version = 'profileclass:1.08, Jan 25 2020 ';
      // The STD profile is always selected and disabled in the UI 
      this.profiles = [ 
        { code: 0, key: 'STD', label: 'Standard user', disabled: true, initialstate: true }, 
        { code: 50, key: 'USERADMIN', label: 'User administrator',  disabled: false, initialstate: true }, 
        { code: 10, key: 'CAMADMIN', label: 'Camera administrator',  disabled: false, initialstate: false }, 
        { code: 100, key: 'SUPERADMIN', label: 'Super administrator',  disabled: false, initialstate: false }, 
      ]
  } 

  // Getter
  getProfileKeys() {

  }
  getInitialValues() {
    let initials = [];
    this.profiles.forEach( (profile) => {
      if (profile.initialstate)
        initials.push(profile.key);
    })
    return initials;
  }

  // This getter returns a properly formatted array for a bootstrap b-form-checkbox-group
  getProfileLabels() {
    let labellist = [];
    this.profiles.forEach( profile => labellist.push( {  
            text: profile.label, 
            value: profile.key, 
            disabled: profile.disabled, 
        }));
    return labellist;
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
