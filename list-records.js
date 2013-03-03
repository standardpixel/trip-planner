var colors     = require('colors'),
	keys       = require(__dirname + '/keys.json'),
	sdb        = require(__dirname + '/simpledb_client.js').client,
    sys        = require('util'),
	record     = process.argv[2],
	at_least_one,
	display_prefix;

console.log('\033[2J');
console.log(('All Simple DB items in the ' + keys.aws.domain + ' domin with the prefix: ' + keys.aws.record_prefix).bold.underline);
console.log('Getting list...');

sdb.select('select * from ' + keys.aws.domain, function(error, result) {
	if(error) {
		console.log('list-domain failed: '+error.Message );
		return false;
	} else {
		
		for(var i=0, l=result.length; l > i; i++) {
			display_prefix = result[i].$ItemName.substring(0,keys.aws.record_prefix.length);
			if(display_prefix === keys.aws.record_prefix) {
				console.log(result[i].$ItemName.substring(display_prefix.length).blue);
				at_least_one=true;
			}
		}
		
		if(!at_least_one) {
			console.log(('There were no items in the ' + keys.aws.domain + ' domain with the prefix: ' + keys.aws.record_prefix).yellow);
		}
	}
});