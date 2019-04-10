exports.execute = (client, arguments, message) => {
	if (message.author.id != '303595846098878466') return;
	client.db.query(arguments, []).then((res, err) => {
		if (err) {
			message.reply(err);
		} else if (res.rowCount > 0) {
			message.reply(res.rows);
		} else {
			message.reply('(pas de résultat trouvé)');
		}
	}).catch((err) => {message.reply(err);});
};
