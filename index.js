var port       = 3000,
    fs         = require('fs'),
	http       = require('http'),
    express    = require('express'),
	simpledb   = require('simpledb'),
	colors     = require('colors'),
	keys       = require(__dirname + '/keys.json'),
    app        = express(),
	hbs        = require('hbs'),
	sdb        = new simpledb.SimpleDB({keyid:keys.aws.key,secret:keys.aws.secret}),
	app_title  = 'StandardPixel event planner';

app.set('views', __dirname + '/ui');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

function setupRoute(route_definition, template_name, params) {
	app.get(route_definition, function(req,res) {
		fs.readFile(__dirname + '/ui/' + template_name, 'utf8', function(error, data) {
			if(error) {
				console.error('Error: Could not load template'.red,error);
			} else {
				hbs.registerPartial('route-content', data);
				
				params['menu-' + params.module] = true;
				res.render('main-template.html', params);
			}
		});
	});
}

setupRoute('/trip', 'trip.html', {
	app_title  : app_title,
	page_title : 'Create a trip',
	module     : 'trip'
});

setupRoute('/', 'index.html', {
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
