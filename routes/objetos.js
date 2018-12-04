var express = require('express');
var router = express.Router();
const PgExecute = require('../models/PgConnection/PgExecute');

router.post('/deletar/:id', (req, res, next) => {

    let pessoa_id = req.body.pessoa_id;

    PgExecute('delete from objeto where id = $1;', 
        [req.params.id], 
        (err, result) => {
            if (err)
            {
                res.send('Erro no banco de dados: ' + err.stack);
            }
            else 
            {
                res.redirect('/objetos/' + pessoa_id);
            }
        }
    );
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
        PgExecute('insert into objeto (pessoa_id, nome) values ($1, $2);',
            [pessoa_id, nome],
            (err, result) => {
                if (err)
                {
                    res.send('Erro no banco de dados: ' + err.stack);
                }
                else 
                {
                    res.redirect('/objetos/' + pessoa_id);
                }
            }
        )
    }
});

router.get('/:id', function(req, res, next) {

    let query = `
        select p.id as pessoa_id, o.id as objeto_id, p.nome as nome_pessoa, o.nome as nome_objeto
        from pessoa p
        left join objeto o on o.pessoa_id = p.id
        where p.id = $1;
    `;
    
    PgExecute(query, [req.params.id], (err, result) => {
        if (err)
        {
            res.send('Erro no banco de dados...');
        }
        else 
        {
            let objetos = [];
            result.rows.forEach(element => {
                objetos.push(element);
            });
            res.render('objetos', { objetos: objetos });
        }
    });
});

module.exports = router;