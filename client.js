'use strict';

const request = require('request');
const fs = require('fs');
const file = process.env.CSV || '/tmp/url-list.csv';
const concurrentLimit = process.env.CONCURRENT_LIMIT || 30;
var currentRequests = 0;
 
/**
 * Send HTTP request.
 * @param  {string} url URL which needs to be accessed
 * @return {void}
 */
 var sendRequest = (url) => {
  currentRequests++;
  var options = {
    uri: url,
    headers: {
      'User-Agent': 'replsv-http-cache-warmup-client'
    },
    timeout: 5000,
    method: 'GET',
    gzip: true
  };
  request(options, (error, res, body) => {
    console.log(url);
    if (error) {
      console.error('ERROR: ' + error.toString());
    } else {
      console.info('HEADERS: ' + 'x-cache: ' + res.headers['x-cache'] + ' / x-cache-hits: ' + res.headers['x-cache-hits'] + ' / status: ' + res.statusCode);
    }
    console.log('--------');
  }).on('response', () => {
    currentRequests--;
  });
};

/**
 * Schedule request and apply some rate limiting through currentRequests value.
 * @param  {string} url
 * @return {bool}
 */
 var scheduleRequest = (url) => {
  if (currentRequests > concurrentLimit) {
    return false;
  }

  setTimeout(() => {
    sendRequest(url);
  }, 1000);

  return true;
};

/**
 * Read file and schedule requests.
 */
 fs.readFile(file, 'utf-8', (err, content) => {
  let urlList = content.split("\n");
  for (let urlIdx in urlList) {
    var sent = false;
    while (!sent) {
      sent = scheduleRequest(urlList[urlIdx]);
    }
  }
});
