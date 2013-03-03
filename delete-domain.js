var colors      = require('colors'),
	keys        = require(__dirname + '/keys.json'),
	sdb         = require(__dirname + '/simpledb_client.js').client,
    sys         = require('util'),
	domain_name = process.argv[2];

console.log('\033[2J');
console.log(('Create domain named: ' + domain_name).bold.underline);
console.log('Killing it...');
sdb.deleteDomain(domain_name,function(err,res,meta){
  if( err ) {
	  console.error('Error: deleting domain'.red, err);
  } else {
	  console.log('Done'.blue);
  }
});
