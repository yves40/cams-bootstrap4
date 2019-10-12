//----------------------------------------------------------------------------
//    datetime.js
//
//    Oct 09 2019   Initial
//    Oct 10 2019   Timer for minutes
//    Oct 12 2019   export default is a problem for node
//----------------------------------------------------------------------------
const Version = 'datetime:1.05, Oct 12 2019';

const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

//----------------------------------------------------------------------------
// Full date & time string 
// syncmode set to TRUE if waiting for the I/O to complete
//----------------------------------------------------------------------------
function getDateTime() {
    let d = new Date();
    return months[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + ' ' 
            + d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") ;
}
function getDate() {
    let d = new Date();
    return months[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + ' ';
}
function getTime() {
    let d = new Date();
    return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") ;
}
function getShortTime() {
    return new Date().toTimeString().slice(0,5);
}
module.exports =  {
    getDateTime: getDateTime,
    getDate: getDate,
    getTime: getTime,
    getShortTime: getShortTime,
}

