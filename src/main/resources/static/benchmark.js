app = angular.module('benchmark', []);

app.config(['$httpProvider', function($httpProvider) {
  //initialize get if not there
  if (!$httpProvider.defaults.headers.get) {
  $httpProvider.defaults.headers.get = {};
  }
  //disable IE ajax request caching
  $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
  // extra
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

app.service('simpleRequestService', function ($http) {
  const service= {};
  service.running = false;
  service.startTimestamp = undefined;
  service.stopTimestamp = undefined;
  service.transferred = 0;
  service.endpoint = '/api/simple';

  service.start = function (chunkSize, maxDelay) {
    chunkSize = chunkSize || 1024;
    maxDelay = maxDelay || 2000;
    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    $http.get(service.endpoint + '?chunk-size=' + chunkSize + '&max-delay=' + maxDelay).then(function (response) {
      service.stopTimestamp = Date.now();
      service.running = false;
      service.transferred = response.data.length;
      console.log('request done');
    });
  };

  return service;
});

app.service('chunkedRequestService', function ($http) {
  const service= {};
  service.running = false;
  service.startTimestamp = undefined;
  service.stopTimestamp = undefined;
  service.transferred = 0;
  service.endpoint = '/api/chunked';

  service.start = function (chunkSize, maxDelay) {
    chunkSize = chunkSize || 1024;
    maxDelay = maxDelay || 2000;
    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    $http.get(service.endpoint + '?chunk-size=' + chunkSize + '&max-delay=' + maxDelay).then(function (response) {
      service.stopTimestamp = Date.now();
      service.running = false;
      service.transferred = response.data.length;
      console.log('request done');
    });
  };

  return service;
});

app.service('longPollingRequestService', function ($http) {
  const service= {};
  service.running = false;
  service.startTimestamp = undefined;
  service.stopTimestamp = undefined;
  service.transferred = 0;
  service.endpoint = '/api/lp';
  service.aggregatedResponse = "";

  service.start = function (chunkSize, maxDelay) {
    chunkSize = chunkSize || 1024;
    maxDelay = maxDelay || 2000;
    function request(callback) {
        return $http.get(service.endpoint + '?chunk-size=' + chunkSize + '&max-delay=' + maxDelay).then(callback);
    }

    function resolve(response) {
        if (response.data.length) {
            service.aggregatedResponse += response.data;
            return request(resolve);
        }
        return service.aggregatedResponse;
    }

    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    request(resolve).then(function (response) {
      service.stopTimestamp = Date.now();
      service.running = false;
      service.transferred = response.length;
      console.log('request done');
    });
  };

  return service;
});

app.service('webSocketService', function ($http, $rootScope) {
  const service= {};
  service.running = false;
  service.startTimestamp = undefined;
  service.stopTimestamp = undefined;
  service.transferred = 0;
  service.endpoint = 'ws://' + location.hostname + ':8080/api/websocket';
  service.aggregatedResponse = "";

  service.start = function (chunkSize, maxDelay) {
    chunkSize = chunkSize || 1024;
    maxDelay = maxDelay || 2000;
    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    webSocket = new WebSocket(service.endpoint);
    // Setup the event callback
    webSocket.onopen = function () {
      webSocket.send('chunkSize:' + chunkSize + ';maxDelay:' + maxDelay);
    };
    webSocket.onerror = function (error) { console.log(error); };
    webSocket.onclose = function () {
      $rootScope.$apply(function () {
        service.stopTimestamp = Date.now();
        service.running = false;
        service.transferred = service.aggregatedResponse.length;
      });
      console.log('request done');
    };
    webSocket.onmessage = function (response) {
      service.aggregatedResponse += response.data
    };
  };

  return service;
});

<<<<<<< Updated upstream
||||||| merged common ancestors
app.service('chunkedXHRRequestService', function ($http,$q) {

  function chunkedRequestWithPromise(chunkSize, maxDelay) {
    var deferred = $q.defer();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `${service.endpoint}?chunk-size=${chunkSize}&max-delay=${maxDelay}`, true);
    xhr.onprogress = function (data) {
      deferred.notify(xhr.responseText);
    };
    xhr.onreadystatechange = function (oEvent) {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              deferred.resolve('success');
          } else {
              deferred.reject(xhr.statusText);
          }
      }
    };
    xhr.send();
    return deferred.promise;
  };

  const service = {};
  service.running = false;
  service.startTimestamp = undefined;
  service.stopTimestamp = undefined;
  service.transferred = 0;
  service.endpoint = '/api/chunked';

  service.start = function (chunkSize = 1024, maxDelay = 2000) {
    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    chunkedRequestWithPromise(chunkSize, maxDelay).then(response => {
      service.stopTimestamp = Date.now();
      service.running = false;
      if (response.data) {
        service.transferred = response.data.length;
        console.log('request done');
      }
    }, null, response => {
      service.stopTimestamp = Date.now();
      if (response) {
        service.transferred = response.length;
      }
    });
  };
  return service;
});

app.service('chunkedDecoratorRequestService', function ($http) {
  const service= {};
  service.running = false;
  service.startTimestamp = undefined;
  service.stopTimestamp = undefined;
  service.transferred = 0;
  service.endpoint = '/api/chunked';

  service.start = function (chunkSize = 1024, maxDelay = 2000) {
    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    $http({method: "GET",
        url: `${service.endpoint}?chunk-size=${chunkSize}&max-delay=${maxDelay}`,
        onProgress: function(event) {
           service.transferred = event.target.response.length;
           service.stopTimestamp = Date.now();
           console.log('data', service.stopTimestamp -service.startTimestamp);
        }}).then(response => {
      service.stopTimestamp = Date.now();
      service.running = false;
      service.transferred = response.data.length;
      console.log('request done');
    });
  };

  return service;
});

=======
app.service('chunkedXHRRequestService', function ($http,$q) {

  function chunkedRequestWithPromise(chunkSize, maxDelay) {
    var deferred = $q.defer();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", service.endpoint + '?chunk-size=' + chunkSize + '&max-delay=' + maxDelay, true);
    xhr.onprogress = function (data) {
      deferred.notify(xhr.responseText);
    };
    xhr.onreadystatechange = function (oEvent) {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              deferred.resolve('success');
          } else {
              deferred.reject(xhr.statusText);
          }
      }
    };
    xhr.send();
    return deferred.promise;
  };

  const service = {};
  service.running = false;
  service.startTimestamp = undefined;
  service.stopTimestamp = undefined;
  service.transferred = 0;
  service.endpoint = '/api/chunked';

  service.start = function (chunkSize, maxDelay) {
    chunkSize = chunkSize || 1024;
    maxDelay = maxDelay || 2000;
    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    chunkedRequestWithPromise(chunkSize, maxDelay).then(function (response) {
      service.stopTimestamp = Date.now();
      service.running = false;
      if (response.data) {
        service.transferred = response.data.length;
        console.log('request done');
      }
    }, null, function (response) {
      service.stopTimestamp = Date.now();
      if (response) {
        service.transferred = response.length;
      }
    });
  };
  return service;
});

app.service('chunkedDecoratorRequestService', function ($http) {
  const service= {};
  service.running = false;
  service.startTimestamp = undefined;
  service.stopTimestamp = undefined;
  service.transferred = 0;
  service.endpoint = '/api/chunked';

  service.start = function (chunkSize, maxDelay) {
    chunkSize = chunkSize || 1024;
    maxDelay = maxDelay || 2000;
    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    $http({method: "GET",
        url: service.endpoint + '?chunk-size=' + chunkSize + '&max-delay=' + maxDelay,
        onProgress: function(event) {
           service.transferred = event.target.response.length;
           service.stopTimestamp = Date.now();
           console.log('data', service.stopTimestamp -service.startTimestamp);
        }}).then(function (response) {
      service.stopTimestamp = Date.now();
      service.running = false;
      service.transferred = response.data.length;
      console.log('request done');
    });
  };

  return service;
});

>>>>>>> Stashed changes
app.component('transferTypeBenchmark', {
    bindings: {
    service: '@',
    test: '@',
  },
  controllerAs: '$ctrl',
    controller: function ($injector) {
    const $ctrl = this;
    $ctrl.$onInit = function () {
      $ctrl.serviceInstance = $injector.get($ctrl.service);
      $ctrl.chunkSize = 1024;
      $ctrl.maxDelay = 2000;
    }
  },
  template: "\
  Chunk size: <input type=\"number\" ng-model=\"$ctrl.chunkSize\"><br>\
  Max delay: <input type=\"number\" ng-model=\"$ctrl.maxDelay\"><br>\
  <button ng-click=\"$ctrl.serviceInstance.start($ctrl.chunkSize, $ctrl.maxDelay)\">Start</button><br>\
  running: {{ $ctrl.serviceInstance.running }}<br>\
  time taken: {{ $ctrl.serviceInstance.stopTimestamp - $ctrl.serviceInstance.startTimestamp }}<br>\
  byte transferred: {{ $ctrl.serviceInstance.transferred }}<br>\
  ",
});
