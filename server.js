if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const apiRouter = require('./routes/api');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;

mongoose.connect(db, function (err) {
  if (!err) {
    console.log(`connected to the Database: ${db}`);
  } else {
    console.log(`error connecting to the Database ${err}`);
  }
});

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', function (req, res) {
  response.status(404).send({reason: 'ROUTE NOT FOUND'})
})

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

app.use(function (err, req, res, next) {
  if (err.name === 'CastError') {
    res.status(400).send({reason: `ID - ${err.value} not found`, stack_trace: err});
  }
  return next(error);
});

app.use(function (err, req, res, next) {
  return res.status(500).send({reason: 'SORRY THERE WAS AN ERROR'});
})
