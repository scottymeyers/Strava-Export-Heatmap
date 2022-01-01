const { createServer } = require('./utils');

const server = createServer();
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server running at http://localhost:3000/');
});
