const Pg = require('pg');
const DBL = require('dblapi.js');
const http = require('http');
const server = http.createServer((req, res) => {
  	res.writeHead(200);
  	res.end('Salut tout le monde !');
});

db = new Pg.Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});

server.listen(process.env.PORT || 3000);
dbl = new DBL(process.env.DBL, {webhookServer: server, webhookAuth: 'gyroidvote'});
dbl.webhook.on('ready', (hook) => {
	console.log(`Le webhook a l'adresse http://${hook.hostname}:${hook.port}${hook.path} est prêt !`);
});

dbl.webhook.on('vote', (vote) => {
	db.query('INSERT INTO votes VALUES($1, NOW());', [vote.user]);
});
