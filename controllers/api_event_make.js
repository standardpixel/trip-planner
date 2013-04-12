var AWS      = require('sp-aws-client'),
	sys      = require('util'),
	check    = require('validator').check,
	sanitize = require('validator').sanitize,
	response = {};

var output,
    forsaving = {};

exports.init = function(params, callback, scope) {
	
	var q    = params.request.body,
	    user = params.user;//TODO:verify authentication.
	
	if(q.name && q.name.length > 3) {
		forsaving.name = sanitize(q.name).xss();
	}
	
	if(q['date-start'] && q['date-start'].length > 3) {
		forsaving['date-start'] = sanitize(q['date-start']).xss();
	}
	
	if(q['date-end'] && q['date-end'].length > 3) {
		forsaving['date-end'] = sanitize(q['date-end']).xss();
	}
	
	if(q['location'] && q['location'].length > 3) {
		forsaving['location']             = sanitize(q['location']).xss();
		forsaving['location_mq_place_id'] = sanitize(q['location_mq_place_id']).xss();
		forsaving['location_mq_type']     = sanitize(q['location_mq_type']).xss();
	}
	
	forsaving['TripId'] = user + ':::' + encodeURI(forsaving.name.toLowerCase().substring(0,64).split(' ').join('_'));

	AWS.getDDB().putItem({'TableName':'sp-tripplanner-events','Item':{
		'TripId'               : { 'S'  : forsaving['TripId']},
		'name'                 : { 'S'  : forsaving['name'] },
		'user'                 : { 'S'  : user},
		'date-start'           : { 'N'  : forsaving['date-start']},
		'date-end'             : { 'N'  : forsaving['date-end']},
		'location'             : { 'NS' : forsaving['location'].split(',')},
		'location_mq_place_id' : { 'N'  : forsaving['location_mq_place_id']},
		'location_mq_type'     : { 'S'  : forsaving['location_mq_type']}
	}}, function(err, r) {
		
		response.status = (!err) ? 'success' : 'error';
		
		if(!err) {
			response.TripId = forsaving['TripId'];
		}
		
		callback.apply(scope, [response]);
	});
	
};