exports.execute = async (client, message) => {
    var command = require('./create');
    var result = await command.execute(client, message);
    var channel = await client.db.query('SELECT * FROM channels WHERE guild = $1 AND type = \'sellers\' LIMIT 1', [message.guild.id]);
    channel = channel.rows;
    if (!channel) return;
    var user = await client.db.query('SELECT * FROM sellers WHERE member = $2 AND guild = $1', [message.guild.id, message.author.id]);
    user = user.rows;
    if (user.length == 1 && message.guild.channels.find(ch => ch.id == user[0].profilemessagechannel)) {
        message.guild.channels.find(ch => ch.id == user[0].profilemessagechannel).fetchMessage(user[0].profilemessageid).then((old) => {
            old.delete();
        }).catch(() => {});
    }
    if (message.guild.channels.find(ch => ch.id == channel[0].id)) {
        message.guild.channels.find(ch => ch.id == channel[0].id).send('**Profil de <@' + message.author.id + '> :**', {embed: result}).then((newMsg) => {
            client.db.query('UPDATE sellers SET profilemessagechannel = $1, profilemessageid = $2 WHERE member = $3 AND guild = $4', [newMsg.channel.id, newMsg.id, message.author.id, message.guild.id]);
        });
    }
};