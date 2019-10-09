//----------------------------------------------------------------------------
//    datetime.js
//
//    Oct 09 2019   Initial
//----------------------------------------------------------------------------
const Version = 'datetime:1.02, Oct 09 2019';

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
export default {
    getDateTime,
    getDate,
    getTime,
}
