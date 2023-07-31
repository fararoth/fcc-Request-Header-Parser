// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.use((req, res, next) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];

  const browser = software.split(') ')[0].split(' (')[1];
  const os = software.split(') ')[1].split(' ')[0];
  const device = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(software) ? 'Mobile Device' : 'Computer';

  res.locals.ipaddress = ipAddress;
  res.locals.language = language;
  res.locals.software = software;
  res.locals.browser = browser;
  res.locals.os = os;
  res.locals.device = device;

  next();
});

app.get('/api/whoami', (req, res) => {
  const { ipaddress, language, software } = res.locals;
  const details = req.query.details;

  if (details === 'true') {
    const { browser, os, device } = res.locals;
    res.json({ ipaddress, language, software, browser, os, device });
  } else {
    res.json({ ipaddress, language, software });
  }
});


// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
