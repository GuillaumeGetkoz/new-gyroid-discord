const Discord = require('discord.js');
const client = new Discord.Client();
const commandDetector = /^\!market ([a-z-]*) ?(.*)$/;
const Pg = require('pg');
const DBL = require('dblapi.js');
client.db = new Pg.Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});
client.dbl = new DBL(process.env.DBL, {webhookPort: 5000, webhookAuth: 'gyroidvote'});
client.commands = ['help', 'set-channel', 'remove-channel', 'add-wishlist', 'remove-wishlist', 'clear-wishlist', 'finish', 'confirm', 'remove-star', 'update-profile', 'add-moneys', 'remove-moneys', 'get-moneys', 'get-profile', 'leaderboard', 'get-ranking', 'create-reward', 'delete-reward', 'get-rewards', 'remove-article', 'query'];
client.nbErrors = 0;
client.avalaibleLang = ['fr', 'en'];

client.dbl.webhook.on('ready', (hook) => {
	console.log(`Le webhook a l'adresse http://${hook.hostname}:${hook.port}${hook.path} est prêt !`);
});

client.dbl.webhook.on('vote', (vote) => {
	client.fetchUser('303595846098878466').then((boss) => {
		boss.createDM().then((channel) => {
			channel.send('<@' + vote.user + '> a voté pour Gyroïd, quel brave homme !');
		});
	});
	client.db.query('INSERT INTO votes VALUES($1, $2)', [vote.user, Date.now()]);
});

client.translate = async (code, userId) => {
	var userLang = await client.db.query('SELECT language FROM language WHERE member = $1', [userId]);
	if (userLang.rows.length == 0) {
		userLang = 'en';
	} else {
		userLang = userLang.rows[0].language;
	}
	var page = require('./languages/' + userLang + '.json');
	if (page[code]) {
		return page[code];
	} else {
		client.fetchUser(userId).then((user) => {
			user.createDM().then((channel) => {
				channel.send('Il faut paramétrer votre langue !');
			});
		});
		var enPage = require('./languages/en.json');
		if (enPage[code]) {
			return enPage[code];
		} else {
			return code;
		}
	}
};

client.on('message', (message) => {
	if (message.author.bot) return;
	if (!message.guild) {
		if (client.avalaibleLang.includes(message.content)) {
			client.db.query('SELECT * FROM language WHERE member = $1', [message.author.id]).then((data) => {
				if (data.rows.length == 0) {
					client.db.query('INSERT INTO language VALUES($1, $2)', [message.author.id, message.content]);
				} else {
					client.db.query('UPDATE language SET language = $2 WHERE member = $1', [message.author.id, message.content]);
				}
				client.translate('lang', message.author.id).then((mess) => {
					message.reply(mess);
				});
			});
		} else {
			message.reply('Ops, it seems I can\'t speak this language.');
		}
	} else if (message.content.match(commandDetector) && client.commands.includes(message.content.match(commandDetector)[1])) {
		try {
			var command = require('./commands/' + message.content.match(commandDetector)[1]);
			command.execute(client, message.content.match(commandDetector)[2], message);
		} catch(error) {
			client.nbErrors++;
			message.reply('Une erreur s\'est produite. Si vous pensez qu\'il s\'agit d\'un bug, vous pouvez le signalez dans le **serveur officiel** (<https://discord.gg/unwNTdc>) dans le salon **#support** en fournissant le code d\'erreur suivant : **' + client.nbErrors + '**');
			console.log('--ERREUR\nCOMMANDE : ' + message.content.match(commandDetector)[1] + '\nCONTENU DU MESSAGE : ' + message.content + '\nCONTENU DE L\'ERREUR : ' + error + '\nCODE : ' + client.nbErrors);
			client.fetchUser('303595846098878466').then((boss) => {
				boss.createDM().then((channel) => {
					channel.send('--ERREUR\nCOMMANDE : ' + message.content.match(commandDetector)[1] + '\nCONTENU DU MESSAGE : ' + message.content + '\nCONTENU DE L\'ERREUR : ' + error + '\nCODE : ' + client.nbErrors);
				});
			});
		}
	} else {
		client.db.query('SELECT type FROM channels WHERE id = $1', [message.channel.id]).then((data) => {
			if (data.rowCount > 0) {
				try {
					var command = require('./channels/' + data.rows[0].type);
					command.execute(client, message);
				} catch(error) {
					client.nbErrors++;
					message.reply('Une erreur s\'est produite. Si vous pensez qu\'il s\'agit d\'un bug, vous pouvez le signalez dans le **serveur officiel** (<https://discord.gg/unwNTdc>) dans le salon **#support** en fournissant le code d\'erreur suivant : **' + client.nbErrors + '**');
					console.log('--ERREUR\nTYPE DE SALON : ' + data.rows[0].type + '\nCONTENU DU MESSAGE : ' + message.content + '\nCONTENU DE L\'ERREUR : ' + error + '\nCODE : ' + client.nbErrors);
					client.fetchUser('303595846098878466').then((boss) => {
						boss.createDM().then((channel) => {
							channel.send('--ERREUR\nTYPE DE SALON : ' + data.rows[0].type + '\nCONTENU DU MESSAGE : ' + message.content + '\nCONTENU DE L\'ERREUR : ' + error + '\nCODE : ' + client.nbErrors);
						});
					});
				}
			}
		});
	}
});

client.on('ready', () => {
	console.log('Bot activé !');
});

/*client.db.query('DELETE FROM language', []).then((res, err) => {
	if (err) {
		console.log(err);
	} else if (res.rowCount > 0) {
		console.log(res.rows);
	} else {
		console.log('(pas de résultat trouvé)');
	}
});*/

client.login(process.env.TOKEN);
