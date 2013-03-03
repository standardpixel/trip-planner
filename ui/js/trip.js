var SP = SP || {};

if(!SP.initialized) {
	SP.initialized=true;
}

SP.trip = (function() {
		
	function init() {
		initView();
	}
	
	function initView() {
		initActiveValidate();
	}
	
	function initActiveValidate() {
		//
		// Date field while typing
		//
		$('form input[type=datetime-local]').on('keyup',function(e) {
			
			if( moment( e.target.value + ' ' ).isValid() ) {
				
				$(e.target).parent().removeClass('warning');
				$(e.target).parent().addClass('success');
				$(e.target).parent().children('.help-inline')[0].innerHTML='Looking good!';
				
			} else {
			
				$(e.target).parent().removeClass('success');
				$(e.target).parent().addClass('warning');
				$(e.target).parent().children('.help-inline')[0].innerHTML='I don\t read that as a date. Can you write it like "August, 7 1977"';
				
			}
			
		});
	}
		
	return {
		init : init
	}
})();
	
SP.trip.init();