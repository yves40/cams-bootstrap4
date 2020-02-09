//----------------------------------------------------------------------------
//    datetime.js
//
//    Oct 09 2019   Initial
//    Oct 10 2019   Timer for minutes
//    Oct 12 2019   export default is a problem for node
//    Oct 29 2019   Get other functions from helpers
//    Feb 09 2020   date format for browser use jj/mm/aaaa
//----------------------------------------------------------------------------
const Version = 'datetime:1.08, Feb 09 2020';

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
function getDateBrowser() {  // For bootstrap / browser date picker format
    let d = new Date(Date.now());
    return d.getFullYear() + '-' +  (d.getMonth() + 1).toString().padStart(2, "0") + '-' + d.getDate().toString().padStart(2, "0");
}
function getTime() {
    let d = new Date();
    return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") ;
}
function getShortTime() {
    return new Date().toTimeString().slice(0,5);
}

function getHoursMinutes() {
    let d = new Date();
    let time = d.getHours() + ':' + d.getMinutes();
    return time;
}

function getHoursMinutesSeconds() {
    let d = new Date();
    return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

function convertDateTime(thedate) {
    if (thedate) {
        let computedate = new Date(thedate);
        let day = computedate.getDate();
        let days = '';
        if (day < 10) days = day.toString().replace(/.*(^\d{1}).*/, "0$1");
            else days = day.toString();
        datetime = months[computedate.getMonth()] + '-' + 
            days + '-' 
            + computedate.getFullYear() + ' ' 
            + computedate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"); 
        return datetime;
    }
    else {
        return "Unset"
    }
}

function convertSecondsToHMS(seconds) {
    let computedate = new Date(1970,0,1);
    computedate.setSeconds(seconds);
    return computedate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");    
}


module.exports =  {
    getDateTime: getDateTime,
    getDate: getDate,
    getDateBrowser: getDateBrowser,
    getTime: getTime,
    getShortTime: getShortTime,
    getHoursMinutes,
    getHoursMinutesSeconds,
    convertDateTime,
    convertSecondsToHMS,
}
