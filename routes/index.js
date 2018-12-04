var express = require('express');
var router = express.Router();
const PgExecute = require('../models/PgConnection/PgExecute');


/* GET home page. */
router.get('/', function(req, res, next) {
  PgExecute('select * from pessoa', null, (err, result) => {
    if (err)
    {
      res.send('Erro no banco de dados: ' + err.stack);
    }
    else 
    {
      let pessoas = []; 
      result.rows.forEach(element => {
        pessoas.push(element);
      });
      res.render('index', { title: 'Express', lista: pessoas });
    }
  });
});

module.exports = router;
