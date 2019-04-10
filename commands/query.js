exports.execute = (client, arguments, message) => {
	if (message.author.id == '303595846098878466')
	client.db.query(arguments, []).then((res, err) => {
		if (err) {
			console.log(err);
		} else if (res.rowCount > 0) {
			console.log(res.rows);
		} else {
			console.log('(pas de résultat trouvé)');
		}
	});
};