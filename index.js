require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const URL = require('url').URL;
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const data = {};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async function(req, res) {
  try {
    const url = req.body.url;
    const urlObject = new URL(req.body.url);
    await dns.promises.lookup(urlObject.hostname, {}, function(err, address, family) {
      if (err) throw err;
    });
    const shortUrl = Math.floor(Math.random() * 100);
    res.status(201);
    data[shortUrl] = url;
    res.json({
      original_url: url,
      short_url: shortUrl
    });
  } catch(err) {
    res.status(400);
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:shortUrl', function(req, res) {
  res.redirect(303, data[req.params.shortUrl])
})

module.exports = app
