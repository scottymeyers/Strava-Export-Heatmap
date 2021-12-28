const chokidar = require('chokidar');
const { createBuild, createServer } = require('./utils');

const server = createServer();

server.listen(3000, () => {
  console.log('Listening at http://localhost:3000');
});

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

    createBuild();
  });
