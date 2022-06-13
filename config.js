var config = {};

config.web = {};
config.mongo = {};
config.asknow = {};

config.web.host = 'hostname';
config.web.port = 6379;
config.mongo.host = 'localhost:27017';
config.asknow.host ='https://asknowdev.service-now.com';
config.asknow.auth ='Basic ZXllU2hhcmVfSW50ZWdyYXRvcjpUZWxldGVjaEAx';

module.exports = config;