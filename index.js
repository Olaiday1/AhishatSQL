const express = require('express');
require('dotenv').config();
const app = express();
const port = 3003;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const userRoutes = require('./src/routes/auth.route');
const postRoutes = require('./src/routes/post.route');

app.get('/', (req, res) => {
  res.send('Hello Devs! Whats up');
});

app.use('/', userRoutes);
app.use('/post', postRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
