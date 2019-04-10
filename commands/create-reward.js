exports.execute = (client, arguments, message) => {
    var argsDetector = /^([0-9]+) <@&([0-9]+)>$/;
    if (arguments.match(argsDetector) == null) return;
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        var mess = await client.translate('noAdmin', message.author.id);
    	message.reply(mess);
    	return;
    }
    if (message.guild.roles.find(r => r.id == arguments.match(argsDetector)[2]).editable == false) {
    	var mess = await client.translate('create-reward.rolePerm', message.author.id);
        message.reply(mess);
    } else {
    	client.db.query('INSERT INTO rewards VALUES($1, $2, $3);', [message.guild.id, arguments.match(argsDetector)[1], arguments.match(argsDetector)[2]]);
    	var mess = await client.translate('create-reward', message.author.id);
        message.reply(mess);
    }
};