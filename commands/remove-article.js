exports.execute = async (client, arguments, message) => {
	var argsDetector = /^([0-9]+)$/;
    if (arguments.match(argsDetector) == null) return;
    var actualData = await client.db.query('SELECT * FROM articles WHERE id = $1', [arguments.match(argsDetector)[1]]);
    actualData = actualData.rows;
    if (!message.member.hasPermission('ADMINISTRATOR') && actualData[0].author != message.author.id) {
    	var mess = await client.translate('noAdmin', message.author.id);
        message.reply(mess + '*Note : chaque vendeur peut supprimer son article en utilisant cette commande.*');
    	return;
    }
    var oldChannel = message.guild.channels.find(ch => ch.id == actualData[0].channel);
    if (oldChannel) {
        oldChannel.fetchMessage(actualData[0].messageid).then((oldMsg) => {
            oldMsg.delete();
        });
    }
    client.db.query('DELETE FROM articles WHERE id = $1', [arguments.match(argsDetector)[1]]);
    var mess = await client.translate('remove-article', message.author.id);
    message.reply(mess);
};