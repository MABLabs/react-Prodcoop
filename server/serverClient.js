var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs');

var SelfReloadJSON = require('self-reload-json');
var moment = require('moment');
var myData = new SelfReloadJSON("../src/data.json");
//var myData = require("../src/data.json");

var override = false;
var overrideLight = false;
var overrideDoor = false;
var overrideFan = false;
var overrideHeat = false;

const SunCalc = require('suncalc');
const sensor = require('ds18b20-raspi');
const rpio = require('rpio');

//Set inmitial states for pin outputs
const light = 12;
const door  = 16;
const heat  = 18;
const fan   = 22;
rpio.open(light, rpio.OUTPUT, rpio.LOW);
rpio.open(door,  rpio.OUTPUT, rpio.LOW);
rpio.open(heat,  rpio.OUTPUT, rpio.LOW);
rpio.open(fan,   rpio.OUTPUT, rpio.LOW);

//var getFiles = require('./query.js').getFiles,
//    ept = require('./mbsdata.js').MbsData;

var port = parseInt(process.argv[2] || '8081', 10);
if (port < 1000)
   console.log('Operating on Port '+port+' requires priveledge');

app.set('port', port);

// Is this even needed, especially in production ?
//        to server up static explained files ???
var home = path.join(__dirname, '..', 'public');
app.use(express.static(home));

// needed for when a form posts a JSON encoded body
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//Process gpio status
setInterval(function() {

//   sensor.readSimpleF(2, (err, temp) => {
//	  if (err) {
//		  console.log(err);
//	  } else {
//      current_temp = temp;
//	  console.log(`${temp} degF`);
//      }
//   });

//    var lat = parseFloat((myData.latitude).toFixed(4));
//    var long = parseFloat((myData.longitude).toFixed(4));

    var times = SunCalc.getTimes(new Date(), myData.latitude, myData.longitude);

   //Process Light
   var dooropen = adjustTime(times.sunrise.getHours(), times.sunrise.getMinutes(), myData.dooropenOffset, 'AM');
   var doorclose = adjustTime((times.sunset.getHours()-12), times.sunset.getMinutes(), myData.doorcloseOffset, 'PM');
   var lighton = adjustTime(times.sunrise.getHours(), times.sunrise.getMinutes()-1, myData.lightonOffset, 'AM');
   var lightoff = adjustTime((times.sunset.getHours()-12), times.sunset.getMinutes()+1, myData.lightoffOffset, 'PM');

   var nowTime = moment(new Date()).format('HH:mm');
   console.log(nowTime);
//   console.log("on = ", lighton);
//   console.log("off = ", lightoff);

   //Process light status
   if (!override) {
     if (moment(nowTime, "HH:mm").isBetween(moment(lighton, "HH:mm"), moment(lightoff, "HH:mm"))) {
       rpio.write(light, rpio.HIGH);
       overrideLight = true;
       console.log("Light On");
     }
     else {
       rpio.write(light, rpio.LOW);
       overrideLight = false;
       console.log("Light Off");
     }
   }
 
   //Process door status
   if (!override) {
     if (moment(nowTime, "HH:mm").isSame(moment(dooropen, "HH:mm")) || moment(nowTime, "HH:mm").isSame(moment(doorclose, "HH:mm"))) {
       rpio.write(door, rpio.HIGH);
       overrideDoor = true;
       console.log("Door Init");
     }
     else {
       rpio.write(door, rpio.LOW);
       overrideDoor = false;
       console.log("Door Off");
     }
   }

   //Get current temperature
   var current_temp; 
   sensor.readSimpleF(2, (err, temp) => {
	if (err) {
           //Somethings wrong, nake sure fan and heat turn off and report error
           rpio.write(fan, rpio.LOW);
           overrideFan = false;
           console.log("Error with temperature prob - Fan Off");
           rpio.write(heat, rpio.LOW);
           overrideHeat = false;
           console.log("Error with temperature prob - Heat Off");

           current_temp = err;
	   console.log(err);
	} 
        else {
           current_temp = temp;
           console.log(current_temp);

          //Process Fan Status
          if (!override) {
             if (current_temp >= myData.fanOn) {
                rpio.write(fan, rpio.HIGH);
                overrideFan = true;
                console.log("Fan On");
             }

            if (current_temp <= myData.fanOff) {
               rpio.write(fan, rpio.LOW);
               overrideFan = false;
               console.log("Fan Off");
            }
         }
     
        //Process Heat Status
        if (!override) {
           if (current_temp <= myData.heatOn) {
             rpio.write(heat, rpio.HIGH);
             overrideHeat = true;
             console.log("Heat On");
           }

           if (current_temp >= myData.heatOff) { 
             rpio.write(heat, rpio.LOW);
             overrideHeat = false;
             console.log("Heat Off");
           }
        }
     }
   });
}, 10000);

function adjustTime(rHours, rMinutes, offset, ampm)
{
  var adjustedTime = '';

  var toffset = rMinutes + offset;
  if (toffset < 0) {
    rHours--;
    toffset = 60 + toffset;
  }

  if (toffset > 59) {
    rHours++;
    toffset = toffset - 60;
  }

  if (ampm == "PM")
  rHours += 12;

  adjustedTime = rHours + ':' + (('00'+toffset).slice(-2));

  return adjustedTime;
}

// -----------------------------------------------------------------------------
//    TEST
// -----------------------------------------------------------------------------

app.get('/api/hello', function (req, res) {
  var now = new Date();
  res.send('Hello World on '+now);
});

// -----------------------------------------------------------------------------
// Migrated from previous version of MbsNode
// -----------------------------------------------------------------------------

// http://ncsvmmbspreprod.nctr.fda.gov/query/files/05-01-2015/05-11-2015/*/M3
// http://ncsvmmbspreprod.nctr.fda.gov/query/files/05-01-2015/05-11-2015/DIA/M3
/*
app.get('/api/query/files/:fromDate/:toDate/:otb/:subjects', function(req, res){

    var files = getFiles('NCTR', req.params.fromDate, req.params.toDate, req.params.otb, req.params.subjects);
    var names = JSON.stringify( files );
    res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
    res.end(names);
});

app.post('/api/query/endpt/', function(req, res){

    var ids = req.body.endpts;
    if (typeof ids != 'Array')
       ids = ids.split(/[ ,]/);

    var getOneAnswer = function (results) {
      var data = JSON.stringify( results );
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':data.length});
      res.end(data);
    };

    ept.getEndpt(req.body.filename, ids, getOneAnswer);
});*/
app.get('/api/current_status/', function(req, res) {

     const statusData = {
         over:  override,
         light: overrideLight,
         door:  overrideDoor,
         heat:  overrideHeat,
         fan:   overrideFan
     }

	  console.log(`${statusData}`);
      var names = JSON.stringify( statusData );
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
      res.end(names);
});

app.get('/api/current_temp/', function(req, res) {
  
    var temp = {Temperature: 72.12}
   // round temperature reading to 1 digit
   sensor.readSimpleF(2, (err, temp) => {
	  if (err) {
		  console.log(err);
	  } else {
	  console.log(`${temp} degF`);
      var names = JSON.stringify( temp );
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
      res.end(names);
	  }
    });
});

//   var url = `/api/myData/${latitude}/${longitude}/${dooropen}/${doorclose}/${lighton}/${lightoff}/${heaton}/${heatoff}/${fanon}/${fanoff}`;
// localhost:8081//api/myData/34.63416667/-92.31388889/-20/30/0/40/35/45/80/75
//var latitude, longitude, dooropen, doorclose, lighton, lightoff, heaton, heatoff, fanon, fanoff;
app.get('/api/myData/:latitude/:longitude/:dooropen/:doorclose/:lighton/:lightoff/:heaton/:heatoff/:fanon/:fanoff', function(req, res){

var err;
//var isGood;
//var latitude, longitude, dooropen, doorclose, lighton, lightoff, heaton, heatoff, fanon, fanoff;
//console.log('Latitude = ', latitude);
//var latitude = req.params.latitude;
  
     const userData = {
         latitude: parseFloat(req.params.latitude),
         longitude: parseFloat(req.params.longitude),
         dooropenOffset: parseInt(req.params.dooropen),
         doorcloseOffset: parseInt(req.params.doorclose),
         lightonOffset: parseInt(req.params.lighton),
         lightoffOffset: parseInt(req.params.lightoff),
         heatOn: parseInt(req.params.heaton),
         heatOff: parseInt(req.params.heatoff),
         fanOn: parseInt(req.params.fanon),
         fanOff: parseInt(req.params.fanoff)
     }
      
//      console.log('userData = ', userData);
      var data = JSON.stringify( userData, null, '\t' );
      fs.writeFile('../src/data.json', data);
      if (err) throw 'error writing file: ' + err;

      let isGood = 'Good';
      if (err) {
         isGood = err;
         }  

//      console.log('data = ', data);
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':data.length});
      var data = JSON.stringify( {isGood} );
      res.end(data);
});

//Send contents of data.json file
app.get('/api/current_parms/', function(req, res) {
  
    var obj;
   fs.readFile('../src/data.json', 'utf8', function (err, data) {
	  if (err) {
		  console.log(err);
	  } else {
	  console.log(data);
      //obj = JSON.parse( data );
      //console.log(obj);
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':data.length});
      res.end(data);
	  }
    });
});

app.get('/api/override_on/', function(req, res) {
  override = true;
  console.log("Override On");
     var names = JSON.stringify( "Override On" );
     res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
     res.end(names);

});

app.get('/api/override_off/', function(req, res) {
  override = false;
  console.log("Override Off");
     var names = JSON.stringify( "Override Off" );
     res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
     res.end(names);
});

app.get('/api/lights_on/', function(req, res) {
  
   overrideLight = true;
   rpio.write(light, rpio.HIGH);
   console.log("Lights On");
      var names = JSON.stringify( "Lights On" );
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
      res.end(names);
});

app.get('/api/lights_off/', function(req, res) {
  
   overrideLight = false;
   rpio.write(light, rpio.LOW);
   console.log("Lights Off");
      var names = JSON.stringify( "Lights Off" );
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
      res.end(names);
});

app.get('/api/door_on/', function(req, res) {
  
   overrideDoor = true;
   rpio.write(door, rpio.HIGH);
   console.log("Door On");
     var names = JSON.stringify( "Door On" );
     res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
     res.end(names);
});

app.get('/api/door_off/', function(req, res) {
  
   overrideDoor = false;
   rpio.write(door, rpio.LOW);
   console.log("Door Off");
      var names = JSON.stringify( "Door Off" );
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
      res.end(names);
});

app.get('/api/heat_on/', function(req, res) {
  
   overrideHeat = true;
   rpio.write(heat, rpio.HIGH);
   console.log("Heat On");
      var names = JSON.stringify( "Heat On" );
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
      res.end(names);
});

app.get('/api/heat_off/', function(req, res) {
  
   overrideHeat = false;
   rpio.write(heat, rpio.LOW);
   console.log("Heat Off");
      var names = JSON.stringify( "Heat Off" );
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
      res.end(names);
});

app.get('/api/fan_on/', function(req, res) {
  
   overrideFan = true;
   rpio.write(fan, rpio.HIGH);
   console.log("Fan On");
      var names = JSON.stringify( "Fan On" );
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
      res.end(names);
});

app.get('/api/fan_off/', function(req, res) {
  
   overrideFan = false;
   rpio.write(fan, rpio.LOW);
   console.log("Fan Off");
      var names = JSON.stringify( "Fan Off" );
      res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length':names.length});
      res.end(names);
});


// -----------------------------------------------------------------------------
//    Call your main react program
// -----------------------------------------------------------------------------

app.use(function(req, res) { res.sendFile(path.join(public, 'index.html')); } );


