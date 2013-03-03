var colors     = require('colors'),
	keys       = require(__dirname + '/keys.json'),
	sdb        = require(__dirname + '/simpledb_client.js').client,
    sys        = require('util'),
	record_key = process.argv[2],
	record_val = JSON.parse(process.argv[3]);

console.log('\033[2J');
console.log('Create record'.bold.underline);

sdb.putItem(keys.aws.domain,keys.aws.record_prefix + record_key,record_val,function(error,data) {
	if(error) {
		console.log(('AWS Response Error ' + error.Message).red, error.Message);
	} else {
		console.log('Added'.green);
	}
});