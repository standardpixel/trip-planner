var AWS      = require('sp-aws-client'),
    moment   = require('moment'),
    colors   = require('colors'),
	http     = require('http'),
    response = {},
	trip     = {},
	human    = {};
	
exports.init = function(params, callback, scope) {
	
	response.user    = params.request.params.user;
	response.trip_id = params.request.params.trip_id;
	
	AWS.getDDB().getItem({
			'TableName':'sp-tripplanner-trips',
			'Key':{ 'HashKeyElement' : { 'S'  : response.user + ':::' + response.trip_id}}
		}, function(error, result) {
		
		response.status = (!error) ? 'success' : 'error';
		
		for(var i in result.Item) {
			if(result.Item.hasOwnProperty(i)) {
				trip[i] = AWS.formatValue(result.Item[i]);
			}
		}
		
		human['date-start']           = moment(parseInt(trip['date-start'], 10)).fromNow();
		human['describes-date-start'] = moment(parseInt(trip['date-start'], 10)).isAfter(new Date()) ? 'begins' : 'began';
		
		
		http.get("http://open.mapquestapi.com/geocoding/v1/reverse?location="+parseFloat(trip['location'][1],10)+","+parseFloat(trip['location'][0],10), function(res) {
			//TODO: Error goes here
		}).on('response', function(response) {
			response.on('data', function (place_raw) {
				response.trip  = trip;
			  	response.human = human;
				response.place = JSON.parse(place_raw).results[0].locations[0];
				
				switch(response.place.geocodeQualityCode.substring(0,2)) {
					case 'P1':	//POINT	A specific point location.
						human['location-type-describer'] = 'near the earthly coordinates';
						human['location-name'] = response.place.displayLatLng.lat + ', ' + response.place.displayLatLng.lng;
					break;
					case 'L1' || 'I1':	//ADDRESS	A specific street address location. or INTERSECTION	An intersection of two or more streets.
						human['location-type-describer'] = 'at';
						human['location-name'] = response.place.street + ', ' + response.place.adminArea5 + ', ' + response.place.adminArea3;
					break;
					case 'B1' || 'B2' || 'B3':	//STREET	The center of a single street block. House number ranges are returned if available. or STREET	The center of a single street block, which is located closest to the geographic center of all matching street blocks. No house number range is returned.
						human['location-type-describer'] = 'at';
						human['location-name'] = response.place.street + ', ' + response.place.adminArea5 + ', ' + response.place.adminArea3;
					break;
					case 'A1':	//COUNTRY	Admin area, largest. For USA, a country.
						human['location-type-describer'] = 'in';
						human['location-name'] = response.place.adminArea1;
					break;
					case 'A3':	//STATE	Admin area. For USA, a state.
						human['location-type-describer'] = 'in';
						human['location-name'] = response.place.adminArea3;
					break;
					case 'A4' || 'A5':	//COUNTY	Admin area. For USA, a county. & CITY	Admin area. For USA, a city.
						human['location-type-describer'] = 'in the city of';
						human['location-name'] = response.place.adminArea5 + ', ' + response.place.adminArea3;
					break;
					case 'Z1' || 'Z2' || 'Z3' || 'Z4':	//ZIP	Postal code, largest. For USA, a ZIP.
						human['location-type-describer'] = 'near the postal code';
						human['location-name'] = response.place.adminArea5 + ', ' + response.place.adminArea3;
					break;
						human['location-type-describer'] = 'near the earthly coordinates';
						human['location-name'] = response.place.displayLatLng.lat + ', ' + response.place.displayLatLng.lng;
					default:
				}
		
			  	callback.apply(scope, [response]);
			 });
		});

	});
	
};