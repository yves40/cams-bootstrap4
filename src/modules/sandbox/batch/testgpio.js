//----------------------------------------------------------------------------
//    testgpio.js
//
//    May 05 2019   Initial
//    May 06 2019   1st test
//----------------------------------------------------------------------------
const Gpio = require('on-off').Gpio;

function getTime() {
    let d = new Date();
    return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") + ' ' ;
  }

const led = new Gpio(18, 'out');

let stopBlinking = false;
 
// Toggle the state of the LED connected to GPIO17 every 200ms
const blinkLed = _ => {
  if (stopBlinking) {
    return led.unexport();
  }
 
  led.read()
    .then(value => led.write(value ^ 1))
    .then(_ => setTimeout(blinkLed, 200))
    .catch(err => console.log(err));
};
 
blinkLed();
 
// Stop blinking the LED after 5 seconds
setTimeout(_ => stopBlinking = true, 5000);