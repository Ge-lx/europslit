const express = require('express');
const async_router = require('express-promise-router');
const glob = require('glob');
const morgan = require('morgan');
const jwt = require('express-jwt');
const { CONFIG } = require('./main');

module.exports.init = function (app, config) {
  // setup middleware

  app.use(morgan('dev'))

  app.set('json spaces', 2) // pretty-print json
  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }))

  app.use('/static', express.static('static'))
  app.use(jwt({ secret: CONFIG.auth.jwtSecret }).unless({ path: ['/signup', '/login'] }));

  // register routes

  let controllers = glob.sync(config.root + '/routes/**/*.js')
  controllers.forEach(function (controller) {
    let router = async_router()
    console.log(' + ' + controller + '...')
    require(controller)(router, config)
    app.use('/', router)
  })

  // 404 and Error handler

  app.use((req, res) => {
    const data = {
      error: new Error('404')
    }
    res.statusCode = 404;
    res.json({
      success: false,
      code: 404,
      message: 'Not Found'
    });
  })

  app.use(function onError (error, req, res, next) {
    res.statusCode = 500;

    if (config.env === 'development') {
      console.log('Uncaught Error: ', error);
      console.log(new Error().stack);
    }

    if (res.statusCode) {
      res.json({
        success: false,
        code: 500,
        message: 'Internal error',
        error: error
      });
    } else {
      next();
    }
  })
}
