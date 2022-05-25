const path = require('path');
const express = require('express');
const logger = require('morgan');

const indexRoute = require('./routes/v1/index');
const indexRoute1 = require('./routes/v1/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Allow CORS
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
app.use('/v1/', indexRoute);
app.use('/v1/', indexRoute1);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const { message } = error;
  let data = error.data || error.sqlMessage;
  console.log(error, 'Status', status, 'Message', message, 'Data', data);
  if (data === undefined && error.name === 'SequelizeUniqueConstraintError') {
    data = error.errors[0].message;
  }
  if (process.env.NODE_ENV !== 'production') {
    res.status(status).json({
      message,
      data
    });
  }
  else if (status === 500) {
    res.status(status).json({
      message: 'internal server error',
      data
    });
  }
  else {
    res.status(status).json({
      message,
      data
    });
  }
});

module.exports = app;
