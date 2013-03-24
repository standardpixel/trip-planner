var AWS      = require('sp-aws-client'),
    moment   = require('moment'),
    colors   = require('colors'),
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
		
		response.trip = trip;
		response.human = human;
		
		callback.apply(scope, [response]);
	});
	
};