const activities = require('../public/output.json');
const compression = require('compression');
const express = require('express');
const path = require('path');
const { build } = require('esbuild');

module.exports = {
  createBuild: () => {
    build({
      bundle: true,
      entryPoints: ['./src/App.jsx'],
      logLevel: 'info',
      minify: true,
      outfile: './public/bundle.js',
      sourcemap: true,
    }).catch((err) => {
      console.log(err);
      process.exit(1);
    });
  },
  createServer: () => {
    const server = express();

    server.set('view engine', 'ejs');
    server.use(compression());
    server.use(express.static(path.join(__dirname, '../public')));

    server.get('/', (req, res) => {
      res.render('index.html');
    });

    server.get('/activities', (req, res) => {
      res.json(activities);
    });

    return server;
  },
};
