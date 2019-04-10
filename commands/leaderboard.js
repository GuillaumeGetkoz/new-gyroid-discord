exports.execute = async (client, arguments, message) => {
	var results = await client.db.query('SELECT * FROM sellers WHERE guild = $1 AND array_length(stars, 1) > 0', [message.guild.id]);
	results = results.rows;
	var mess1 = await client.translate('leaderboard.noSeller1', message.author.id);
	var mess2 = await client.translate('leaderboard.noSeller1', message.author.id);
	var title = mess1;
	var description = mess2;
	if (results.length > 0) {
		var fields = '';
		var i = 0;
		var messStar = await client.translate('star', message.author.id);
		var messStars = await client.translate('stars', message.author.id);
		results.forEach((val) => {
			if (i < 20) {
				i++;
				var starw = 'étoiles';
				if (val.stars.length == 1) {
					starw = 'étoile';
				}
				fields += '\n``' + i + '``. <@' + val.member + '> - **' + val.stars.length + ' ' + starw + '**';
			}
		});
		var mess = await client.translate('leaderboard', message.author.id);
		title = mess + ' **' + message.guild.name + '**';
		description = fields;
	}
	message.channel.send('', {"embed": {
		"title": title,
		"description": description
	}});
};