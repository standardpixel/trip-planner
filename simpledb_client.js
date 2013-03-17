var AWS  = require('aws-sdk'),
	keys = require(__dirname + '/keys.json'),
	sdb  = aws.createSimpleDBClient(keys.aws.key, keys.aws.secret, {secure:false});
	
exports.client = sdb;