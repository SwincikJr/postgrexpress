
const PgExecute = (query, values, callback) => {
    
    const { Client } = require('pg');
    var Config = require('./ConnectionConfig');

    const client = new Client(Config);

    client.connect();

    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    });

};

module.exports = PgExecute;