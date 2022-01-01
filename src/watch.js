const chokidar = require('chokidar');
const { build } = require('esbuild');
const { createServer } = require('./utils');

const server = createServer();
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const createBuild = () => {
  build({
    bundle: true,
    entryPoints: ['./src/components/Map.jsx'],
    loader: {
      ['.js']: 'jsx',
    },
    logLevel: 'info',
    minify: true,
    outfile: './public/bundle.js',
    sourcemap: true,
  }).catch((err) => {
    console.log(err);
    process.exit(1);
  });
};

chokidar
  .watch('./src', {
    ignoreInitial: true,
  })
  .on('all', (event, path) => {
    console.log('✓ ', event, path);
    createBuild();
  })
  .on('ready', () => {
    console.log('\n========================');
    console.log('➢ Waiting for changes...');
    console.log('========================\n');
    createBuild();
  });
