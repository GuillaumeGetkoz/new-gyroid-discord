exports.execute = async (client, arguments, message) => {
	var argsDetector = /^<@!?([0-9]+)>$/;
	if (arguments.match(argsDetector) == null) {
		message.reply('Oups, il semeblerait que votre syntaxe ne soit pas bonne. Veuillez juste mentionner le vendeur dont vous voulez obtenir le classement.');
		return;
	}
	var results = await client.db.query('SELECT * FROM sellers WHERE guild = $1 AND array_length(stars, 1) > 0', [message.guild.id]);
	results = results.rows;
	var title = 'Il n\'y a pas encore de vendeur sur ce serveur.';
	var description = 'Je suis sûr que ça va bientôt changer !';
	var top = 0;
	if (results.length > 0) {
		var fields = [];
		var i = 0;
		var messStar = await client.translate('star', message.author.id);
		var messStars = await client.translate('star', message.author.id);
		results.forEach((val) => {
			if (i < 20) {
				i++;
				if (val.stars.length == 1) {
					var starw = messStar;
				} else {
					var starw = messStars;
				}
				if (val.member == arguments.match(argsDetector)[1]) {
					top = i;
				}
				fields.push('\n``' + i + '``. <@' + val.member + '> - **' + val.stars.length + ' ' + starw + '**');
			}
		});
		var mess1 = await client.translate('leaderboard', message.author.id);
		title = mess + ' **' + message.guild.name + '**';
		description = fields;
	}
	if (top == 0) {
		var mess = await client.translate('get-ranking.noSeller', message.author.id);
		message.reply(mess);
		return;
	}
	if (top == 1) {
		var start = 0;
	} else {
		var start = top - 4;
	}
	var mess2 = await client.translate('get-ranking', message.author.id);
	client.fetchUser(arguments.match(argsDetector)[1]).then((user) => {
		message.reply(mess2 ' **' + user.username + '** :', {"embed": {
			"description": fields.slice(start, top + 4).join('')
		}});
	});
};