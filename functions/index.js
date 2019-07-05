const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

var serviceAccount = require("./key.json");

admin.initializeApp({ 
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://leilaouff.firebaseio.com"
});

const app = express();
app.use(cors({
  origin: '*'
}));
app.get('/newPlayer', (request, response) => {
	//response.setHeader("Access-Control-Allow-Origin", "*");

	let genero = request.query.genero;
	let idade = request.query.idade;
	let universidade = request.query.universidade;
	let curso = request.query.curso;
	let periodo = request.query.periodo;
	let participou = request.query.participou;
	let modalidade = request.query.modalidade;
	let tipo = request.query.tipo;

	if(modalidade == 'undefined' || modalidade == "")
	{
		modalidade = "Não Preenchido";
	}

	if(participou == "false")
	{
		participou = "Não";
	}
	else
	{
		participou = "Sim";
	}

	if(tipo == "" || tipo =="undefined")
	{
		tipo = "Não preenchido";
	}

	if( genero && idade && universidade && curso && periodo && participou)
	{
		var k = admin.database().ref(`participantes/`).push({
			genero:genero, 
			idade:idade,
			universidade:universidade,
			curso:curso,
			periodo:periodo,
			participou:participou,
			modalidade:modalidade,
			tipo:tipo
		})
		.then(function(snapshot) {
			response.json({"key": snapshot.key});
		})
		.catch( error => {
			response.send(error);
		});
	}
	else
	{
		responde.send("false");
	}
});


app.get('/leilao', (request,response) => {
	let idUser = request.query.userID;
	let item = request.query.item;

	if(item == 1 && idUser)
	{
		response.json(
		{
			'item' : 'Relógio Breitling J Class De Ouro',
			'link' : 'dist/images/leilao/1.jpg',
			'esp' : 'Relógio Breitling aço e ouro 18k, quartz, suíço, vidro de safira, calendário, cronógrafo, medida 41mm, J Class, ref D53067.',
			'min' : '2.000',
			'caixa' : '30.000'
		});
	}
	else if (item == 2 && idUser)
	{
		response.json({
			'item' : 'Iphone 7',
			'link' : 'dist/images/leilao/2.jpg',
			'esp' : 'Com uma entrada para cartão SIM, o Apple iPhone 7 32GB permite download máximo até 450 Mbps para navegação na internet, mas isto também depende da operadora, que inclui Bluetooth Versão 4.2 com A2DP, WiFi 802.11 a/b/g/n/ac + MIMO (2.4Ghz/5Ghz).',
			'min' : '1.300',
			'caixa' : '8.000'
		});
	}
	else if ( item == 3 && idUser)
	{
		response.json({
			'item' : 'Obra de Arte – autor Basquiat (Obra sem título)',
			'link' : 'dist/images/leilao/3.jpg',
			'esp' : 'Basquiat(1960-1988) nasceu em NY, é considerado um dos artistas mais importantes da segunda metade do século XX. \n A Obra sem título, é uma pintura de 1,83 metros de altura e 1,73 de largura, apresentado um perfil em forma de caveira, tinta acrílica, lápis de cera e spray, pintada em 1982 e vendida 2017.',
			'min' : '192.669.000',
			'caixa' : '800.000.000'
		});
	}
	else
	{
		response.send('Error');	
	}
});

app.get('/registro', (request,response) => {
	let idUser = request.query.userID;
	let item = request.query.item;
	let valor = request.query.valor;
	let time = request.query.tempo;

	admin.database().ref(`participantes/${idUser}/itens/lance${item}`).update({
			lance:valor,
			tempo:time
		})
		.then(function(snapshot) {
			response.json({"registrado": true});
		})
		.catch( error => {
			response.send(error);
		});
});


app.get('/dados' , (request,response) => {
	let idUser = request.query.userID;
	if(idUser)
	{
		admin.database().ref(`/participantes/${idUser}`).once('value').then(function(snapshot) {
	       var myPlayer = snapshot.val();
	       response.json(myPlayer);
	   });
	}
	else
	{
		response.send('ERROR');
	}
	
});


app.get('/questionario' , (request,response) => {
	let idUser = request.query.userID;
	let satisfAn = request.query.satisfAn;
	let satisfDp = request.query.satisfDp;
	let bemMaior = request.query.bemMaior;
	let conLei = request.query.conLei;
	let conVal = request.query.conVal;
	let influ = request.query.influ;
	let ouviuFal = request.query.ouviuFal;
	let caiuMal = request.query.caiuMal;
	console.log('executou');

	if( satisfAn && satisfDp && bemMaior && conLei && conVal && influ && ouviuFal && caiuMal && idUser)
	{
		admin.database().ref(`participantes/${idUser}/questionario`).update({
			satisfAn:satisfAn,
			satisfDp:satisfDp,
			bemMaior:bemMaior,
			conLei:conLei,
			conVal:conVal,
			influ:influ,
			ouviuFal:ouviuFal,
			caiuMal:caiuMal
		})
		.then(function(snapshot) {
			console.log("Deu certo");
			response.json({"msg": "success"});
		})
		.catch( error => {
			console.log("Deu ruim");
			response.json({"msg": "error"});
		});
	}



});


app.get('/dadosCompletos' , (request,response) => {
	admin.database().ref(`/participantes/`).once('value').then(function(snapshot) {
	       var myPlayer = snapshot.val();
	       response.json(myPlayer);
	   });
});

exports.app = functions.https.onRequest(app);