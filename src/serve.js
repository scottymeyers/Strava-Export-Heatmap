const { createServer } = require('./utils');

const server = createServer();

server.listen(3000, () => {
  console.log('Listening at http://localhost:3000');
});
