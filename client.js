'use strict';

const request = require('request');
const fs = require('fs');
const file = '/tmp/url-list.csv';
const concurentLimit = 30;
var currentRequests = 0;

/**
 * Send HTTP request.
 * @param  {string} url URL which needs to be accessed
 * @return {void}
 */
var sendRequest = (url) => {
  currentRequests++;
  var options = {
    uri: domain + url,
    headers: {
      'User-Agent': 'replsv-http-cache-warmup-client'
    },
    timeout: 5000,
    method: 'GET'
  };
  request(options, (error, res, body) => {
        console.log(domain + urlKey);
    if (error) {
      console.log('ERROR: ' + error.toString());
    } else {
      console.log('HEADERS: ' + 'x-cache: ' + res.headers['x-cache'] + ' / x-cache-hits: ' + res.headers['x-cache-hits']);
    }
        console.log('--------');
    currentRequests--;
  });
};

/**
 * Schedule request and apply some rate limiting through currentRequests value.
 * @param  {string} url
 * @return {bool}
 */
var scheduleRequest = (url) => {
  if (currentRequests > concurentLimit) {
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
  for (urlIdx in urlList) {
    var sent = false;
    while (!sent) {
      sent = scheduleRequest(urlList[urlIdx]);
    }
  }
});