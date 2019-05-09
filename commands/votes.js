exports.execute = (client, arguments, message) => {
	if (message.author.id != '303595846098878466') return;
	client.db.query('SELECT * FROM votes').then((votes) => {
		var mess = '';
		votes.rows.forEach((val) => {
			mess += '- <@' + val.member + '> a voté pour Gyroïd à' + val.moment + '\n';
		});
		message.reply(mess);
	});
};
