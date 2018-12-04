var express = require('express');
var router = express.Router();
const PgExecute = require('../models/PgConnection/PgExecute');

router.post('/deletar/:id', (req, res, next) => {
    PgExecute('delete from pessoa where id = $1;',
        [req.params.id],
        (err, result) => {
            if (err)
            {
                res.send('Erro no banco de dados: ' + err.stack);
            }
            else 
            {
                res.redirect('/');
            }
        }
    );
});

router.get('/criar', (req, res, next) => {
    res.render('criar', {erros : [], pessoa : { nome : null, nascimento : null }});
});

router.post('/criar', function(req, res, next) {
    
    let nome = req.body.nome;
    let nascimento = req.body.nascimento;
    let erros = [];

    if(nome == null || nome == '')
    {
        erros.push('O preenchimento do nome é obrigatório');
    }

    if (nascimento == null || nascimento == '')
    {
        erros.push('O preenchimento da data de nascimento é obrigatória');
    }

    if (erros.length > 0)
    {
        res.render('criar', { erros: erros, pessoa: { nome: nome, nascimento: nascimento } });
    }
    else 
    {
        PgExecute('insert into pessoa (nome, nascimento) values ($1, $2);',
            [nome, nascimento],
            (err, result) => {
                if (err)
                {
                    res.send('Erro no banco de dados: ' + err.stack);
                }
                else 
                {
                    res.redirect('/');
                }
            }
        )
    }
});

module.exports = router;