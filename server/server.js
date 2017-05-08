const express = require('express');
const path = require('path');
const app = express();

var PROJ = path.join(__dirname, '../public');

app.use(express.static(PROJ));

app.get('/', function (req, res) {
  res.sendFile(path.join(PROJ, 'index.html'));
});

app.listen(80);
