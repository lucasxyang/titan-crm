/////////////////////////////////////////////////
// The logging module.
// Uses winston logging library for node.
// Initialization and configuration for our app-
// wide logger.
//
// @file:   logging.js
// @author: Anurag Bhandari <anurag@ofssam.com>
/////////////////////////////////////////////////

var winston = require('winston');

module.exports = function() {
    // All info-level messages should be logged inside /logs/info.log
    winston.add(winston.transports.File, {
        name: 'info-file',
        level: 'info',
        filename: './src/logs/info.log',
        maxsize: 10*1024*1024*1024, // 10 MB in bytes
        humanReadableUnhandledException: true
    });
    // All error messages should be logged inside /logs/error.log
    winston.add(winston.transports.File, {
        name: 'error-file',
        level: 'error',
        filename: './src/logs/error.log',
        maxsize: 10*1024*1024*1024, // 10 MB in bytes
        handleExceptions: true,
        humanReadableUnhandledException: true
    });
};