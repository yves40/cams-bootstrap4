//----------------------------------------------------------------------------
//    testgpio.js
//
//    May 05 2019   Initial
//    May 06 2019   1st test
//    May 10 2019   2nd test on PI4
//                  Out for a led and switch input
//----------------------------------------------------------------------------
const Gpio = require('onoff').Gpio;
const Version = 'testgpio 1.12, May 10 2020'

function getTime() {
    let d = new Date();
    return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") + ' ' ;
  }

const led = new Gpio(18, 'out');
const switchin = new Gpio(23, 'in', 'both', {debounceTimeout: 10});  // Be informed when the input voltage to a GPIO pin is rising from 0V (to 3.3V)

let stopBlinking = false;
 
// Track the switch state wit a call back
switchin.watch( ( err, value ) => {
  if( err ) {
    console.log( 'Error', err );
  }

  // log pin value (0 or 1)
  led.write(value);
  console.log( 'Pin value', value );
  console.log( 'Event type ', switchin.edge());
} );

// Toggle the state of the LED connected to GPIO17 every 200ms
const blinkLed = _ => {
  if (stopBlinking) {
    return led.unexport();
  }
  led.read()
    .then(value => led.write(value ^ 1))
    .then(_ => setTimeout(blinkLed, 1000))
    .catch(err => console.log(err));
};

console.log(Version);
process.on('SIGINT', _ => {
  console.log('\n\nGracefull shutdown freeing resources\n\n');
  led.unexport();
  switchin.unexport();
});


// blinkLed();
 
// Stop blinking the LED after 5 seconds
setTimeout(_ => stopBlinking = true, 10000);