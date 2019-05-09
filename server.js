const Pg = require('pg');
const DBL = require('dblapi.js');
const http = require('http');
const server = http.createServer((req, res) => {
  	res.writeHead(200);
  	res.end('Salut tout le monde !');
});

client.db = new Pg.Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});

server.listen(process.env.PORT || 3000);
client.dbl = new DBL(process.env.DBL, {webhookServer: server, webhookAuth: 'gyroidvote'});
client.dbl.webhook.on('ready', (hook) => {
	isOk = `Le webhook a l'adresse http://${hook.hostname}:${hook.port}${hook.path} est prêt !`;
	console.log(`Le webhook a l'adresse http://${hook.hostname}:${hook.port}${hook.path} est prêt !`);
});

client.dbl.webhook.on('vote', (vote) => {
	client.fetchUser('303595846098878466').then((boss) => {
		boss.createDM().then((channel) => {
			channel.send('<@' + vote.user + '> a voté pour Gyroïd, quel brave homme !');
		});
	});
	client.db.query('INSERT INTO votes VALUES($1, NOW());', [vote.user]);
});
