//Routine to read HC-SR04 Sensor
const rpio = require('rpio');

var pulse_start = 0;
var pulse_end = 0;
var pulse_duration = 0;
var distance = 0;

var TRIG = 23; //GPIO11
var ECHO = 24; //GPIO8

rpio.open(TRIG, rpio.OUTPUT);
rpio.open(ECHO, rpio.INPUT);

rpio.write(TRIG, rpio.LOW);
rpio.sleep(2); //Sleep for 2 seconds

rpio.write(TRIG, rpio.HIGH);
rpio.usleep(10); //Sleep for 0.00001 seconds
rpio.write(TRIG, rpio.LOW);

while (rpio.read(ECHO) == rpio. LOW) {
//   pulse_start = Math.floor(Date.now() / 1000);
   pulse_start = Date.now() / 1000;
}

while (rpio.read(ECHO) == rpio.HIGH) {
//   pulse_end = Math.floor(Date.now() / 1000);
   pulse_end = Date.now() / 1000;
}

console.log('Start = ', pulse_start);
console.log('Stop = ', pulse_end);

pulse_duration = pulse_end - pulse_start
console.log('Duration = ', pulse_duration);

distance = pulse_duration * 17150

distance = distance.toFixed(2);

console.log('Distance = ', distance);
console.log(((31-(distance-5))/31)*100);
