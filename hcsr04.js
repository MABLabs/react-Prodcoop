//Routine to read HC-SR04 Sensor
const rpio = require('rpio');
const time = require('time');

var pulse_start = 0;
var pulse_end = 0;
var pulse_duration = 0;
var distance = 0;

var TRIG = 23; //GPIO11
var ECHO = 24; //GPIO8

rpio.open(TRIG, rpio.OUTPUT);
rpio.open(ECHO, rpio.INPUT);

rpio.write(TRIG, rpio.LOW);
rpio.sleep(2);

rpio.write(TRIG, rpio.HIGH);
rpio.usleep(1);
rpio.write(TRIG, rpio.LOW);

while (rpio.read(ECHO) == 0)
    pulse_start = time.time(); 

while (rpio.read(ECHO) == 1)
    pulse_end = time.time();

pulse_duration = pulse_end - pulse_start

distance = pulse_duration * 17150

distance = distance.toFixed(2);

console.log(distance);
