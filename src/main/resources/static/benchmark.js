app = angular.module('benchmark', []);

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
      // service.transferred = response.data;
      console.log('request done');
    });
  }

  return service;
});

app.component('transferTypeBenchmark', {
  bindings: {
    service: '@',
    test: '@',
  },
  controllerAs: '$ctrl',
  controller: function ($injector) {
    var $ctrl = this;
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
