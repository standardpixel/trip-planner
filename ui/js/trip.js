var SP = SP || {};

if(!SP.initialized) {
	SP.initialized=true;
}

SP.createTransId = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "_";

    var id = s.join("");
    return id;
}

SP.transactions = {};

SP.responses = {};

SP.trip = (function() {
	
	var location_field_verification_id,
	    validated_values = {};
		
	function init() {
		initView();
	}
	
	function initView() {
		
		initActiveValidate();
		
	}
	
	function initActiveValidate() {
		
		//
		// Name field
		//
		$('form#create-trip input[name=name]').on('keyup',function(e) {
			
			if( e.target.value.length > 3 && jQuery.type( e.target.value ) === 'string' && jQuery.type( e.target.value.substring(0,1) ) !== 'number' ) {
				
				validated_values[e.target.name] = e.target.value;
				$(e.target).parent().removeClass('warning');
				$(e.target).parent().addClass('success');
				$(e.target).parent().children('.help-inline')[0].innerHTML='Looking good!';
				
			} else if(e.target.value < 4) {
				
				$(e.target).parent().removeClass('warning');
				$(e.target).parent().removeClass('success');
				$(e.target).parent().children('.help-inline')[0].innerHTML='';
				
			} else {
			
				$(e.target).parent().removeClass('success');
				$(e.target).parent().addClass('warning');
				$(e.target).parent().children('.help-inline')[0].innerHTML='Names have to be at least 4 charicters in length and can not start with a number';
				
			}
			
		});
		
		//
		// Date field while typing
		//
		$('form#create-trip input[type=datetime-local]').on('keyup',function(e) {
			
			var user_moment = moment( e.target.value + ' ' );
			
			if( user_moment.isValid() && user_moment.toDate() > new Date()) {
				
				validated_values[e.target.name] = user_moment.valueOf();
				$(e.target).parent().removeClass('warning');
				$(e.target).parent().addClass('success');
				$(e.target).parent().children('.help-inline')[0].innerHTML='Looking good!';
				
			} else if(e.target.value.length === 0) {
			
				$(e.target).parent().removeClass('warning');
				$(e.target).parent().removeClass('success');
				$(e.target).parent().children('.help-inline')[0].innerHTML='';
			
			} else {
			
				$(e.target).parent().removeClass('success');
				$(e.target).parent().addClass('warning');
				$(e.target).parent().children('.help-inline')[0].innerHTML='I don\'t read that as a date. Can you write it like "August, 7 1977"?';
				
			}
			
		});
		
		//
		// Location field while typing.
		//
		$('form#create-trip input[name=location]').on('keyup',function(e) {
			
			if(location_field_verification_id) {
				clearTimeout(location_field_verification_id);
			}
			
			location_field_verification_id = setTimeout(function() {
				
				if(e.target.value.length > 6) {
					verifyLocation(e.target.value, function(r) {
						
						if( r.length ) {

							validated_values[e.target.name] = r[0].lat + ',' + r[0].lon;
							validated_values[e.target.name + '_mq_type'] = r[0].type;
							validated_values[e.target.name + '_mq_place_id'] = r[0].place_id;
							$(e.target).parent().removeClass('warning');
							$(e.target).parent().addClass('success');
							$(e.target).parent().children('.help-inline')[0].innerHTML='I found ' + r[0].display_name + ' which looks like a match.';
				
						} else {
			
							$(e.target).parent().removeClass('success');
							$(e.target).parent().addClass('warning');
							$(e.target).parent().children('.help-inline')[0].innerHTML='There are no locations which match that on _this_ planet.';
				
						}
						
					});
				}
				
				location_field_verification_id = null;
	
			}, 1000);
			
		});
		
		$('form#create-trip button.btn-primary').on('click',function(e) {
			
			e.preventDefault();
			
			$.ajax({
				url: $('form#create-trip')[0].action,
				method: 'post',
				data: validated_values,
				success: function( data ) {
					if(data && data.status === 'success') {
						location.href = '/' + data.TripId.split(':::')[0] + '/' + data.TripId.split(':::')[1];
					} else {
						console.error('Error: Creating trip', data);
					}
				}
			});
			
		});
		
	}
	
	function verifyLocation(location_string, callback) {
		var uid      = SP.createTransId(),
		    trans_id = 'validate_location' + uid;
		
		SP.transactions[trans_id] = callback;
		
		$.ajax({url: 'http://open.mapquestapi.com/nominatim/v1/search.php?format=json&json_callback=SP.transactions.' + trans_id + '&q=' + encodeURIComponent(location_string)}).done(function(data,status,$) {
			if(status !== 'success') {
				console.log('Warn: was not able to contact the mapquest API and could not validate this field');
			}
		});
		
		return uid;
	}
		
	return {
		init : init
	}
})();
	
SP.trip.init();