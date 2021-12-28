const chokidar = require('chokidar');
const { createBuild, serve } = require('./utils');

chokidar
  .watch('./src/**', {
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
    serve();
    createBuild();
  });
