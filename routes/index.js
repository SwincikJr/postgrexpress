var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

  const { Client } = require('pg');

  const client = new Client({
    user: 'user',
    host: 'host',
    database: 'database',
    password: 'password',
    port: 5432,
  });

  client.connect();

  client.query('select * from pessoa', (err, response) => {
    if (err)
    {
      res.send('Erro no banco de dados...');
    }
    else 
    {

      let pessoas = [];
      
      response.rows.forEach(element => {
        pessoas.push(element);
      });

      res.render('index', { title: 'Express', lista: pessoas });
    }
    client.end();
  });
});

module.exports = router;
