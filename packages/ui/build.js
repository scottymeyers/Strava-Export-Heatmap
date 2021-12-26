const chokidar = require('chokidar');
const { build } = require('esbuild');
const { createServer } = require('http-server');

const env = process.env.NODE_ENV;

const serve = () => {
  const server = createServer({
    autoIndex: false,
    brotli: true,
    cache: -1,
    gzip: true,
    minify: true,
    showDir: true
  });
  const PORT = 3000;
  server.listen(PORT);
  console.log('Server is listen at http://localhost:3000/');
};

const createBuild = () => {
  build({
    bundle: true,
    define: {
      'process.env.NODE_ENV': `'${env}'`
    },
    entryPoints: ['./src/App.jsx'],
    logLevel: 'info',
    minify: true,
    outfile: './public/bundle.js',
    sourcemap: true,
  }).catch((err) => {
    console.log(err);
    process.exit(1);
  })
};

chokidar.watch('./src/**', {
  ignoreInitial: true,
}).on('all', (event, path) => {
  console.log('✓ ', event, path);
  createBuild();
}).on('ready', () => {
  console.log('\n========================');
  console.log('➢ Waiting for changes...');
  console.log('========================\n');
  serve();
  createBuild();
});

process.on('warning', (warning) => {
  console.log(warning.stack);
});