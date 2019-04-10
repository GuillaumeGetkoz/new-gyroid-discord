exports.execute = async (client, arguments, message) => {
    var argsDetector = /"(.[^"]*)"/g;
    var noMoneys = '';
    if (arguments.match(argsDetector) == null) return;
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        message.reply('Vous ne pouvez pas utiliser cette commande !');
        return;
    }
    arguments.match(argsDetector).forEach((el) => {
        var elDetector = /^"(.*)"$/;
        client.db.query('DELETE FROM moneys WHERE guild = $1 AND moneys = $2', [message.guild.id, el.match(elDetector)[1]]);
    });
    var actualMoneys = await client.db.query('SELECT * FROM moneys WHERE guild = $1', [message.guild.id]);
    if (actualMoneys.rows.length == 0) {
        var mess2 = await client.translate('noAdmin', message.author.id);
        noMoneys = '\n' + mess2;
    }
    var mess = await client.translate('remove-moneys', message.author.id);
    message.reply(mess + noMoneys);
};