exports.execute = async (client, arguments, message) => {
    var argsDetector = /^<#([0-9]*)>$/;
    if (arguments.match(argsDetector) == null) return;
    if (!message.member.hasPermission('ADMINISTRATOR')) {
    	message.reply('Vous ne pouvez pas utiliser cette commande !');
    	return;
    }
    client.db.query('DELETE FROM channels WHERE id = $1', [arguments.match(argsDetector)[1]]).then((data) => {
        var mess = await client.translate('remove-channel', message.author.id);
        message.reply(mess);
    });
};