const path = require('path');
const express = require('express');
const { createMemoryHistory } = require('svelte-routing');
const app = require('./App.html');

const history = createMemoryHistory();
const server = express();

server.use(express.static(path.join(__dirname, 'dist')));

server.get('*', function(req, res) {
  history.replace(req.url);

  res.write(`
    <!DOCTYPE html>
    <link rel="stylesheet" href="/styles.css">
    <div id="app">${app.render()}</div>
    <script src="/bundle.js"></script>
  `);

  res.end();
});

const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
