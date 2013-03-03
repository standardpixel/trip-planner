var colors     = require('colors'),
	keys       = require(__dirname + '/keys.json'),
	sdb        = require(__dirname + '/simpledb_client.js').client,
    sys        = require('util'),
	record_key = process.argv[2];

console.log('\033[2J');

function done(error) {
	if(error) {
		console.error('Error: deleting record'.red, error);
	} else {
		console.log('Done'.blue);
	}
}

if(process.argv[3]) {
	console.log(('Deleting properties: ' + JSON.stringify(process.argv[3]) + ' of record:' + record_key).bold.underline);
	sdb.deleteItem(keys.aws.record_prefix, keys.aws.record_prefix + record_key, JSON.parse(process.argv[3]), done);
} else {
	console.log(('Deleting record ' + record_key).bold.underline);
	sdb.deleteItem(keys.aws.domaingit , keys.aws.record_prefix + record_key, done);
}
