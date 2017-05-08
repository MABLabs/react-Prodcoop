const express = require('express');
const path = require('path');
const app = express();

var PROJ = path.join(__dirname, '../public');

app.use(express.static(PROJ));

// -----------------------------------------------------------------------------
//    TEST
// -----------------------------------------------------------------------------

app.get('/api/hello', function (req, res) {
  var now = new Date();
  res.send('Hello World on '+now);
});

// -----------------------------------------------------------------------------
//    Add your api stuff here
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//    Call your main react program
// -----------------------------------------------------------------------------

app.use(function(req, res) { res.sendFile(path.join(public, 'index.html')); } );

app.listen(80);
