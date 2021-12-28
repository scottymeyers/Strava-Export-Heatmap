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
  serve: () => {
    const app = express();
    const port = 3000;

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}`);
    });
  },
};
