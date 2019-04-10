exports.execute = async (client, arguments, message) => {
    var argsDetector = /^([0-9]+) (⭐)? ?([0-5]) (.*)$/;
    var star;
    if (arguments.match(argsDetector) == null) {
        var mess = await client.translate('confirm.syntax', message.author.id);
        message.reply(mess);
        return;
    }
    var actualData = await client.db.query('SELECT * FROM articles WHERE id = $1', [arguments.match(argsDetector)[1]]);
    actualData = actualData.rows;
    if (actualData.length > 0 && actualData[0].buyer == message.author.id && actualData[0].author != message.author.id) {
        var seller = await client.db.query('SELECT * FROM sellers WHERE member = $1 AND guild = $2', [actualData[0].author, message.guild.id]);
        seller = seller.rows[0];
        if (!seller) {
            await client.db.query('INSERT INTO sellers VALUES($1, $2, \'{}\', \'{}\', 0, 0);', [actualData[0].author, message.guild.id]);
            seller = {
                member: actualData[0].author,
                guild: message.guild.id,
                wishlist: [],
                stars: []
            }
        }
        if (arguments.match(argsDetector)[2] != undefined) {
            star = true;
        } else {
            star = false;
        }
        client.db.query('INSERT INTO valuations VALUES($1, $2, $3, $4, $5, $6);', [actualData[0].author, message.guild.id, message.author.id, arguments.match(argsDetector)[3], arguments.match(argsDetector)[4], star]);
        if (!seller.stars.includes(message.author.id) && star == true) {
            await client.db.query('UPDATE sellers SET stars = array_append(stars, $1) WHERE member = $2 AND guild = $3', [message.author.id, seller.member, message.guild.id]);
        }
        var oldChannel = message.guild.channels.find(ch => ch.id == actualData[0].channel);
        if (oldChannel) {
            oldChannel.fetchMessage(actualData[0].messageid).then((oldMsg) => {
                oldMsg.delete();
            });
        }
        var profile = require('../profiles-commands/post');
        var msg = message;
        client.fetchUser(actualData[0].author).then((user) => {
            msg.author = user;
            profile.execute(client, msg);
            client.db.query('DELETE FROM articles WHERE id = $1', [arguments.match(argsDetector)[1]]);
        });
    } else {
        var mess = await client.translate('confirm.noArticle', message.author.id);
        message.reply(mess);
        return;
    }
    var mess = await client.translate('confirm', message.author.id);
    message.reply(mess);
    var rewards = await client.db.query('SELECT * FROM rewards WHERE guild = $1 AND stars = $2', [message.guild.id, seller.stars.length + 1]);
    if (rewards.rows[0]) {
        client.fetchUser(actualData[0].author).then((user) => {
            message.guild.fetchMember(user).then((guildMember) => {
                guildMember.addRole(rewards.rows[0].role).catch(() => {});
            });
        });
    }
};