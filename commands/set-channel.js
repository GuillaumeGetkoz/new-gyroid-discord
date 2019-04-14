exports.execute = async (client, arguments, message) => {
    var argsDetector = /^<#([0-9]+)> (.+)$/;
    if (arguments.match(argsDetector) == null) return;
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        var mess = await client.translate('noAdmin', message.author.id);
    	message.reply(mess);
    	return;
    }
    var request = '';
    var types = ['sell', 'buy', 'sellers', 'say', 'test'];
    if (!types.includes(arguments.match(argsDetector)[2])) return;
    var mess = await client.translate('set-channel', message.author.id);
    client.db.query('SELECT type FROM channels WHERE id = $1', [arguments.match(argsDetector)[1]]).then((data) => {
        if (data.rowCount == 0) {
            request = 'INSERT INTO channels VALUES($1, $3, $2);';
        } else {
            request = 'UPDATE channels SET type = $2 WHERE id = $1 AND guild = $3';
        }
        client.db.query(request, [arguments.match(argsDetector)[1], arguments.match(argsDetector)[2], message.guild.id]).then((data) => {
            message.reply(mess);
        });
    });
};
