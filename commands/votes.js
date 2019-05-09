exports.execute = (client, arguments, message) => {
	if (message.author.id != '303595846098878466') return;
	client.db.query('SELECT * FROM votes').then((votes) => {
		votes.forEach((val) => {
			mess += '- <@' + val.member + '> a voté pour Gyroïd à' + val.moment;
		});
		message.reply(mess);
	});
};
