var response = {},
	fake_user = 'eric'; //TODO:replace this with an actual user account
	
exports.init = function(params, callback, scope) {
	
	response.user = params.request.params.user;
		
	callback.apply(scope, [response]);
	
};