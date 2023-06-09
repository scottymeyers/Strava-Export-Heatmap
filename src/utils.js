const compression = require('compression');
const express = require('express');

const path = require('path');

module.exports = {
  createServer: () => {
    const server = express();

    server.set('view engine', 'ejs');
    server.use(compression());
    server.use(express.static(path.join(__dirname, '../public')));

    server.get('/', (_, res) => {
      res.render('index.html');
    });

    server.get('/activities', (_, res) => {
      res.header('Content-Type', 'application/json');
      res.sendFile(path.join(__dirname, '../public/activities.json'));
    });

    return server;
  },
};
