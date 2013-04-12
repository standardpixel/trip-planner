var AWS      = require('sp-aws-client'),
    moment   = require('moment'),
    colors   = require('colors'),
	http     = require('http');
	
exports.init = function(params, callback, scope) {
	scope = scope || this;
	
	AWS.getDDB().scan({
			'TableName':'sp-tripplanner-trips',
			'ScanFilter':{
				'user':{'AttributeValueList':[{'S':'eric'}],'ComparisonOperator':'EQ'}
			}
		}, function(error, result) {
			var out = {},
			    i   = null,
				l   = result.Items.length;
			
			if(error) {
				console.error(error);
			}
			
			for(i=0; l > i; i++) {
				result.Items[i].c_url = result.Items[i].user.S + '/trips/' + result.Items[i].TripId.S.split(':::')[1];
			}
			
			
			out = {
				trips : result.Items,
				count : result.Count
			}
		
			callback.apply(scope,[out]);
		}
	);
	
};