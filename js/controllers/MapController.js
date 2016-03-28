(function() {
	'use strict';

	angular
		.module('gps')
		.controller('MapController', MapController);

		MapController.$inject = ['$scope', 'ConsumerService', 'leafletBoundsHelpers', '$interval'];

		function MapController($scope, ConsumerService, leafletBoundsHelpers, $interval) {
			var map = this;
			map.title = 'Map';

            map.getTrucks       = getTrucks;
            map.getBounds       = getBounds;
            map.initMap         = initMap;
            map.updateMarkers   = updateMarkers;
            map.formatTrucks    = formatTrucks;
            map.fixPosition     = fixPosition;

            map.image           = 'map_unmsm.png';
            map.name            = 'UNMSM';
            map.type            = 'imageOverlay';

            //map.center          = {lat:-12.063189600000001, lng:-77.0999219};
            map.center          = {lat:-12.0564791, lng:-77.0828385};

            map.markers         = {};
            map.cnt             = 0;

            map.scale_lat       = 100000*1.1;
            map.scale_lng       = 100000*0.77;
            map.refresh         = 1000 * 1;

			activate();


			function activate(){
				map.initMap();
                $interval(map.updateMarkers, map.refresh);
			}

			function initMap(){
				var bounds = map.getBounds();
                
				angular
					.extend($scope, {
    						defaults: {
        						scrollWheelZoom: false,
        						crs: 'Simple',
        						maxZoom: 2,
                                minZoom: -100
    						},
                            center: {
                                lat: 0,
                                lng: 0,
                                zoom: -1
                            },
                            maxBounds: bounds,
                            layers: {
                                baselayers: {
                                    andes: {
                                        name:   map.name,
                                        type:   map.type,
                                        url:    map.image,
                                        bounds: [[-540, -960], [540, 960]],
                                        layerParams: {
                                          noWrap: true,
                                        }
                                    }
                                },
                            }

					});
			}

			function getTrucks(){
				ConsumerService.getTrucks()
                    .success(function(data){
                        map.markers = map.formatTrucks(data.trucks);
                        map.cnt++;
                    })
                    .error(function(data){
                        map.cnt = 0;
                    });
			}

            function formatTrucks(data) {
                var markers =   {};
                for (var i = 0; i < data.length; i++) {
                    if(!data[i].position)continue;
                    console.log(data[i].id);
                    if(i == 2)continue;
                    markers[data[i].id] = map.fixPosition(data[i].position);
                }

                markers["center"] = {
                    lat: map.center.lng,
                    lng: map.center.lat,
                };

                return markers;
            }

            function fixPosition(data) {
                var lng = (data.latitude -  map.center.lat) * map.scale_lat;
                var lat = (map.center.lng - data.longitude) * map.scale_lng;
                console.log({lat: lat, lng: lng});
                return {lat: lat, lng: lng, icon: {iconUrl: 'img/camion.jpg'}};
            }

            function updateMarkers(){
                map.getTrucks();
            }

			function getBounds(){
				return leafletBoundsHelpers
							.createBoundsFromArray([[-540, -960], [540, 960]]);
			}
		}
})();