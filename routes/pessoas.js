var express = require('express');
var router = express.Router();

router.post('/deletar/:id', (req, res, next) => {

    const { Client } = require('pg');

    const client = new Client({
        user: 'user',
        host: 'host',
        database: 'database',
        password: 'password',
        port: 5432,
    });

    const query = {
        text: 'delete from pessoa where id = $1;',
        values: [req.params.id]
    };

    client.connect();
    
    client.query(query, (err, resp) => {
        if (err)
        {
            res.send('Erro no banco de dados: ' + err.stack);
        }
        else 
        {
            res.redirect('/');
        }

        client.end();
    });
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
        const { Client } = require('pg');

        const client = new Client({
            user: 'user',
            host: 'host',
            database: 'database',
            password: 'password',
            port: 5432,
        });

        const query = {
            text: 'insert into pessoa (nome, nascimento) values ($1, $2);',
            values: [nome, nascimento]
        };

        client.connect();

        client.query('set client_encoding to LATIN1;', (err, resp) => {
            client.query(query, (err, resp) => {
                if (err)
                {
                    res.send('Erro no banco de dados: ' + err.stack);
                }
                else 
                {
                    res.redirect('/');
                }
        
                client.end();
            })
        });
    }
});

module.exports = router;