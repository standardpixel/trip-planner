var AWS      = require('sp-aws-client'),
    colors   = require('colors'),
    response = {},
	trip     = {};
	
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
		
		response.trip = trip;
		
		console.log(trip);
		
		callback.apply(scope, [response]);
	});
	
};