var port       = 3000,
	http       = require('http'),
    express    = require('express'),
	simpledb   = require('simpledb'),
	colors     = require('colors'),
	keys       = require(__dirname + '/keys.json'),
    app        = express(),
	sdb        = new simpledb.SimpleDB({keyid:keys.aws.key,secret:keys.aws.secret}),
	app_title  = 'StandardPixel event planner';

app.set('views', __dirname + '/ui');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/trip', function(req,res) {
	res.render('trip.html', {
	 	app_title : app_title,
		module    : 'trip'
	});
});

app.get('/', function(req,res) {
	res.render('index.html', {
	 	app_title : app_title,
		module    : 'index'
	});
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
