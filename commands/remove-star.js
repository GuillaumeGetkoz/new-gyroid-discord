exports.execute = async (client, arguments, message) => {
    var argsDetector = /^<@!?([0-9]+)>$/;
    if (arguments.match(argsDetector) == null) {
        var mess = await client.translate('remove-star.syntax', message.author.id);
        message.reply(mess);
        return;
    }
    var data = await client.db.query('SELECT stars FROM sellers WHERE guild = $1 AND member = $2', [message.guild.id, arguments.match(argsDetector)[1]]);
    data = data.rows;
    if (data.length == 0 || !data[0].stars.includes(message.author.id)) {
        var mess = await client.translate('remove-star.noSeller', message.author.id);
        message.reply(mess);
        return;
    }
    client.db.query('UPDATE sellers SET stars = array_remove(stars, $1) WHERE member = $2 AND guild = $3', [message.author.id, arguments.match(argsDetector)[1], message.guild.id]);
    var profile = require('../profiles-commands/post');
    client.fetchUser(arguments.match(argsDetector)[1]).then((user) => {
        msg.author = user;
        profile.execute(client, msg);
    });
    var mess = await client.translate('remove-star', message.author.id);
    message.reply(mess);
};