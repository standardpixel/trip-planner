var colors      = require('colors'),
	keys        = require(__dirname + '/keys.json'),
	sdb         = require(__dirname + '/simpledb_client.js').client,
    sys         = require('util'),
	domain_name = process.argv[2],
	exists;

console.log('\033[2J');
console.log(('Create domain named: ' + domain_name).bold.underline);

sdb.listDomains(function(err,res,meta){
	if(err) {
		console.error('Error: getting domain list'.red,err);
	} else {
		if(res && res.length) {
			for(var i=0, l=res.length; l > i; i++) {
				if(res[i] === domain_name) {
					exists = true;
				}
			}
		}
	}
	
	if(exists) {
		console.log('That domain already exists. Doing nothing'.yellow);
	} else {
		if(process.argv[2]) {
			console.log('Working...');
			sdb.createDomain(process.argv[2],function(err,res,meta){
			  if( err ) {
			    console.error('Error: creating domain'.red, err);
			  } else {
			  	console.log('done'.green);
			  }
			});
		} else {
			console.error('Error: This script needs one argument which is a string name for the domain'.red);
		}
	}
});
