exports.execute = async (client, arguments, message) => {
    var argsDetector = /^([0-9]+) <@!?([0-9]+)>$/;
    if (arguments.match(argsDetector) == null) {
        var mess = await client.translate('finish.syntax', message.author.id);
        message.reply(mess);
        return;
    }
    var actualData = await client.db.query('SELECT * FROM articles WHERE id = $1', [arguments.match(argsDetector)[1]]);
    actualData = actualData.rows;
    if (actualData.length > 0) {
        if (actualData[0].author == message.author.id) {
            client.db.query('UPDATE articles SET buyer = $1 WHERE id = $2', [arguments.match(argsDetector)[2], arguments.match(argsDetector)[1]]);
        } else {
            var mess = await client.translate('finish.noSeller', message.author.id);
            message.reply(mess);
            return;
        }
    } else {
        var mess = await client.translate('finish.noArticle', message.author.id);
        message.reply(mess);
        return;
    }
    var mess1 = await client.translate('finish.1', message.author.id);
    var mess2 = await client.translate('finish.2', message.author.id);
    message.reply(mess1 + arguments.match(argsDetector)[1] + mess2);
};