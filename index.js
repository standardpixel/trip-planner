var port       = 3000,
    fs         = require('fs'),
	http       = require('http'),
    express    = require('express'),
	colors     = require('colors'),
    app        = express(),
	hbs        = require('hbs'),
	app_title  = 'StandardPixel event planner';

app.use(express.bodyParser());
app.set('views', __dirname + '/ui');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

function setupUIRoute(route_definition, template_name, params) {
	console.log('setup route called');
	app.get(route_definition, function(req,res) {
		fs.readFile(__dirname + '/ui/' + template_name, 'utf8', function(error, data) {
			if(error) {
				console.error('Error: Could not load template'.red,error);
			} else {
				if(params.controller) {
					var controller = require(__dirname + '/controllers/' + params.controller).init({
						request  : req,
						response : res
					}, function(response) {
						hbs.registerPartial('route-content', data);
						
						for(var i in response) {
							if(response.hasOwnProperty(i)) {
								params[i] = response[i];
							}
						}
				
						params['menu-' + params.module] = true;
						res.render('main-template.html', params);
					}, this);
				} else {
					hbs.registerPartial('route-content', data);
				
					params['menu-' + params.module] = true;
					res.render('main-template.html', params);
				}
			}
		});
	});
}

function setupAPIRoute(route_definition, params) {
	app.post(route_definition, function(req,res) {
		var controller = require(__dirname + '/controllers/' + params.controller).init({
			request : req
		}, function(response) {
			res.json(response);
		}, this);
	});
}

setupAPIRoute('/api/makeTrip', {
	controller : 'api_make_trip'
})

setupUIRoute('/make', 'make.html', {
	app_title  : app_title,
	page_title : 'Make a trip',
	module     : 'make'
});

setupUIRoute('/:user', 'user.html', {
	app_title  : app_title,
	page_title : 'User',
	module     : 'user',
	controller : 'user'
});

setupUIRoute('/', 'index.html', {
	app_title  : app_title,
	page_title : 'Welcome',
	module     : 'index'
});

app.use('/js', express.static(__dirname + '/ui/js'));
app.use('/style', express.static(__dirname + '/ui/style'));
app.use('/lib', express.static(__dirname + '/ui/lib'));

app.listen = function(port){
  var server = http.createServer(this);
  console.log('\033[2J');
  console.log(('On ' + new Date()));
  console.log('\r\nthe '+ app_title.underline.blue +' app was started on port ' + port.toString().underline.blue);
  console.log('\r\nTo stop press Ctrl+C');
  return server.listen.apply(server, arguments);
};

app.listen(port);
