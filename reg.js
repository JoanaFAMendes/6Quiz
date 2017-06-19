var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var port = process.env.PORT || 3000;
//var server1 = "wquizz.herokuapp.com"
var server1 = "http://localhost:3000"
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ["abc"]
}));

var perguntas;
//respostas;

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'webitcloud.net',
    user: 'webitclo_G504',
    password: 'PW1617ESMAD_P2235',
    database: 'webitclo_G504'
});


app.get('/', function (req, res) {

    res.sendfile("login.html");

});


app.get('/app', function (req, res) {

    res.sendfile("perguntas.html");

});

//Criar registo do utilizador
//app.use(express.bodyParser());
app.get('/registo', function (req, res) {



    var nome = req.param('nome');
    var passe = req.param('passe');
    var email = req.param('email');
    console.log(nome)
    var sql = "INSERT INTO Utilizador (nome_utilizador,password,email) VALUES ('" + nome + "','" + passe + "','" + email + "');";
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {

    });
});


//verificar se utilizador existe para fazer login
app.post('/login', function (req, res) {
    var user1 = req.param('user1');
    var passeUser = req.param('passeUser');
    console.log(user1)
    //var sql = "SELECT EXISTS(SELECT * FROM Utilizador WHERE nome_utilizador like '" + user1+"');";
    var sql = "SELECT * FROM Utilizador WHERE email like '" + user1 + "' and password like'" + passeUser + "';"
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        console.log(rows);
        if (!err) {
            if (rows[0] === undefined) {
                res.status(500).send("Erro no email ou password");
                console.log("erro");
                //res.send("erro");
            } else {
                req.session.user1 = rows[0].email;
                req.session.passeUser = rows[0].password;
                user = rows[0].email;
                res.status(200).send("Sucessos");
                console.log("sucesso");
                res.send("sucesso");
            }
        }
        else {
            res.status(500).send("Serviço indisponivel");
        }
    });
});

//Vai buscar os temas à base de dados
app.get('/temas', function (req, res) {
    console.log("aparece temas");
    connection.query('SELECT nome_tema from Tema;', function (err, rows, fields) {
        console.log(err);
        if (!err) {
            res.send(rows);
        }
        else
            console.log('Error while performing query. ');
    });
});

//vai buscar as perguntas à base de dados
app.get('/perguntas', function (req, res) {
    var tema = req.param('tema'); //nome_tema
    var nivel = req.param('nivel'); //nivel da pergunta
    var nAleatorio = req.param('nAleatorio'); 
    // connection.query('SELECT * from Perguntas where dificuldade=' + nivel + ' and id_tema like (select id_tema from Tema where nome_tema=' + tema + ');', function (err, rows, fields) {
    //     res.send(rows);
    // });
    var sql = "SELECT p.pergunta, p.id_pergunta from Pergunta p, Tema t where p.id_tema=t.id_tema and nome_tema ='"+tema+"' and dificuldade="+nivel+" ORDER BY RAND() LIMIT "+nAleatorio+";";
      console.log(sql);
      connection.query(sql, function (err, rows, fields) {
      
        res.send(rows);
       //console.log(rows);
    });
});

app.get('/jogo', function(req, res){
    var nivel = req.param('nivel');
    var tema = req.param('tema');
    var d = new Date();
    var n = d.getTime();
    jogo=tema+n;
    connection.query('insert into Jogo (id_jogo, nome_jogo, nivel, pontuacao_jogo) values('+jogo+','+tema+','+nivel+',100);', function(err,rows,fields){
        
    });
});

app.get('/respostas', function(req, res){
    var perguntaID = req.param('perguntaID'); //id_pergunta
    var sql='SELECT r.id_resposta, resposta, validade from Resposta r, Pergunta_Resposta p where id_pergunta='+perguntaID+' and r.id_resposta=p.id_resposta;';
    console.log(sql);
    connection.query(sql, function(err, rows,fields){
        res.send(rows);
    });
});



app.listen(port);

