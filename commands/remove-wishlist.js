exports.execute = async (client, arguments, message) => {
    var argsDetector = /"(.[^"]*)"/g;
    if (arguments.match(argsDetector) == null) return;
    var data = await client.db.query('SELECT * FROM sellers WHERE guild = $1 AND member = $2', [message.guild.id, message.author.id]);
    if (data.rows.length == 0) {
        await client.db.query('INSERT INTO sellers VALUES($1, $2, \'{}\', \'{}\', 0, 0);', [message.author.id, message.guild.id]);
    }
    arguments.match(argsDetector).forEach((el) => {
        var elDetector = /^"(.*)"$/;
        client.db.query('UPDATE sellers SET wishlist = array_remove(wishlist, $1) WHERE member = $2 AND guild = $3', [el.match(elDetector)[1], message.author.id, message.guild.id]);
    });
    var profile = require('../profiles-commands/post');
    profile.execute(client, message);
    var mess = await client.translate('remove-wishlist', message.author.id);
    message.reply(mess);
};