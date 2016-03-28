(function() {
	'use strict';

	angular
		.module('gps')
		.factory('ConsumerService', ConsumerService);

	ConsumerService.$inject = ['$http', 'api_url'];

	function ConsumerService($http, api_url) {
		var service = {
			getTrucks: getTrucks
		}
		return service;

		function getTrucks(){
			var url = api_url + 'location';

			return $http.get(url);
		}
	}

})();