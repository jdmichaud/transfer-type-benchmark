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

  service.start = function () {
    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    $http.get(service.endpoint).then(response => {
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

  service.start = function () {
    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    $http.get(service.endpoint).then(response => {
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

  function request(callback) {
    return $http.get(service.endpoint).then(callback);
  }

  function resolve(response) {
    if (response.data.length) {
      service.aggregatedResponse += response.data;
      return request(resolve);
    }
    return service.aggregatedResponse;
  }

  service.start = function () {
    console.log('starting request');
    service.startTimestamp = Date.now();
    service.running = true;
    request(resolve).then(response => {
      service.stopTimestamp = Date.now();
      service.running = false;
      service.transferred = response.length;
      console.log('request done');
    });
  };

  return service;
});

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
    }
  },
  template: `
    <button ng-click="$ctrl.serviceInstance.start()">Start</button><br>
    running: {{ $ctrl.serviceInstance.running }}<br>
    time taken: {{ $ctrl.serviceInstance.stopTimestamp - $ctrl.serviceInstance.startTimestamp }}<br>
    byte transferred: {{ $ctrl.serviceInstance.transferred }}<br>
  `,
});
