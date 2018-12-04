var express = require('express');
var router = express.Router();

router.post('/deletar/:id', (req, res, next) => {

    let pessoa_id = req.body.pessoa_id;

    const { Client } = require('pg');

    const client = new Client({
        user: 'user',
        host: 'host',
        database: 'database',
        password: 'password',
        port: 5432,
    });

    const query = {
        text: 'delete from objeto where id = $1;',
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
            res.redirect('/objetos/' + pessoa_id);
        }

        client.end();
    });

});

router.get('/criar/:id', (req, res, next) => {
    res.render('criar_objeto', { erros : [], pessoa_id : req.params.id });
});

router.post('/criar', (req, res, next) => {
    let pessoa_id = req.body.pessoa_id;
    let nome = req.body.nome;

    let erros = [];

    if(nome == null || nome == '')
    {
        erros.push('O preenchimento do nome é obrigatório');
        res.render('criar_objeto', { erros : erros, pessoa_id : pessoa_id });
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
            text: 'insert into objeto (pessoa_id, nome) values ($1, $2);',
            values: [pessoa_id, nome]
        };

        client.connect();

        
        client.query(query, (err, resp) => {
            if (err)
            {
                res.send('Erro no banco de dados: ' + err.stack);
            }
            else 
            {
                res.redirect('/objetos/' + pessoa_id);
            }
    
            client.end();
        });
        
    }
});

router.get('/:id', function(req, res, next) {

    const query = {
        text: `select p.id as pessoa_id, o.id as objeto_id, p.nome as nome_pessoa, o.nome as nome_objeto
            from pessoa p
            left join objeto o on o.pessoa_id = p.id
            where p.id = $1;`,
        values: [req.params.id]
    };

    const { Client } = require('pg');

    const client = new Client({
        user: 'user',
        host: 'host',
        database: 'database',
        password: 'password',
        port: 5432,
    });

    client.connect();

    client.query(query, (err, resp) => {
        if (err)
        {
            res.send('Erro no banco de dados...');
        }
        else 
        {
            let objetos = [];

            resp.rows.forEach(element => {
                objetos.push(element);
            });

            res.render('objetos', { objetos: objetos });
        }

        client.end();
    });
});

module.exports = router;