var colors      = require('colors'),
	keys        = require(__dirname + '/keys.json'),
	sdb         = require(__dirname + '/simpledb_client.js').client,
    sys         = require('util')

console.log('\033[2J');
console.log('List domains for StandardPixel'.bold.underline);

sdb.listDomains(function(err,res,meta){
	if(err) {
		console.error('Error: getting domain list'.red,err);
	} else {
		if(res && res.length) {
			for(var i=0, l=res.length; l > i; i++) {
				console.log(res[i].blue);
			}
		} else {
			console.log('There were no domins returned. Are you sure you have any?'.yellow);
		}
	}
});
