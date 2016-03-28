(function(){
	'use strict';
	
	angular
		.module('gps', ['leaflet-directive']);

	angular
		.module('gps')
		.config(function($logProvider){
		  $logProvider.debugEnabled(false);
		});
})();
