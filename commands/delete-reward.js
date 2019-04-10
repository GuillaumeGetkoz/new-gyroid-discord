exports.execute = (client, arguments, message) => {
	var argsDetector = /^([0-9]+)$/;
    if (arguments.match(argsDetector) == null) return;
    if (!message.member.hasPermission('ADMINISTRATOR')) {
    	var mess = await client.translate('noAdmin', message.author.id);
    	message.reply(mess;
    	return;
    }
    client.db.query('DELETE FROM rewards WHERE guild = $1 AND stars = $2', [message.guild.id, arguments.match(argsDetector)[1]]);
    var mess = await client.translate('delete-reward', message.author.id);
    message.reply(mess);
};