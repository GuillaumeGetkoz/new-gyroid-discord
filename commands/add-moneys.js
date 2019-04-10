exports.execute = async (client, arguments, message) => {
    var argsDetector = /"(.[^"]*)"/g;
    if (arguments.match(argsDetector) == null) return;
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        var mess = await client.translate('noAdmin', message.author.id);
    	message.reply(mess);
    	return;
    }
     arguments.match(argsDetector).forEach((el) => {
        var elDetector = /^"(.*)"$/;
        client.db.query('INSERT INTO moneys VALUES($1, $2);', [message.guild.id, el.match(elDetector)[1]]);
    });
     var mess = await client.translate('add-moneys', message.author.id);
    message.reply(mess);
};