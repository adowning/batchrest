var http = require("http");
var Q = require("q");

function callRemoteRest(theRequest, callback) {
  var options = {
    host: theRequest.host,
    port: theRequest.port,
    path: theRequest.command,
  };

  var req = http.request(options, function (resp) {
    var respString = "";
    resp.on("data", function (chunk) {
      respString += chunk;
    });

    resp.on("end", function () {
      var respBody = {};
      try {
        respBody = JSON.parse(respString);
      } catch (ex) {
        respBody = {
          success: false,
          message: "Error occurred parsing response.",
        };
      }

      callback(respBody, theRequest);
    });
  });

  req.end();
}

// asynchronous retrieval of rest calls for higher performance
exports.batchGetAsync = function (req, res) {
  console.log(req.body);
  // default answer
  var answer = { success: false };
  res.setHeader("Content-type", "application/json");
  res.setHeader("Authorization", "Basic NGM4T1JQbk86Q2ppVU1ydHZxZVg0TVN0MA==");

  // requested rest calls
  var requests = req.body.requests;

  if (!requests) {
    answer.message = "ERROR: No REST calls provided.";
    res.write(JSON.stringify(answer), "utf8");
    res.end();
  } else {
    answer.responses = {};

    var responseCount = 0;

    for (var i = 0; i < requests.length; i++) {
      var thisRequest = requests[i];

      try {
        callRemoteRest(requests[i], function (resp, origRequest) {
          answer.responses[origRequest.requestId] = resp;
          responseCount++;
          if (responseCount == requests.length) {
            answer.success = true;
            res.write(JSON.stringify(answer), "utf8");
            res.end();
          }
        });
      } catch (ex) {
        // error - return with response
        answer.success = false;
        answer.message = error;
        res.write(JSON.stringify(answer), "utf8");
        res.end();
      }
    }
  }
};

// synchronous retrieval of rest calls for lighter server load
exports.batchGetSync = function (req, res) {
  // default answer
  var answer = { success: false };
  res.setHeader("Content-type", "application/json");

  // requested rest calls
  var requests = req.body.requests;

  if (!requests) {
    answer.message = "ERROR: No REST calls provided.";
    res.write(JSON.stringify(answer), "utf8");
    res.end();
  } else {
    answer.responses = {};

    // start with empty chain
    var promiseChain = Q.fcall(function () {});

    for (var i = 0; i < requests.length; i++) {
      var promiseLink = function () {
        var deferred = Q.defer();
        // pop next request off front of array
        var thisRequest = requests.shift();

        callRemoteRest(thisRequest, function (resp) {
          answer.responses[thisRequest.requestId] = resp;
          deferred.resolve();
        });
        return deferred.promise;
      };

      promiseChain = promiseChain.then(promiseLink);
    }

    function returnResponse() {
      answer.success = true;
      res.write(JSON.stringify(answer), "utf8");
      res.end();
    }

    // the final action is to return the response
    promiseChain
      .then(returnResponse, function (error) {
        // error - return with response
        answer.success = false;
        answer.message = error;
        res.write(JSON.stringify(answer), "utf8");
        res.end();
      })
      .done();
  }
};
