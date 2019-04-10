exports.execute = async (client, arguments, message) => {
    await client.db.query('UPDATE sellers SET wishlist = \'{}\' WHERE member = $1 AND guild = $2', [message.author.id, message.guild.id]);
    var profile = require('../profiles-commands/post');
    profile.execute(client, message);
    var mess = await client.translate('clear-wishlist', message.author.id);
    message.reply(mess);
};