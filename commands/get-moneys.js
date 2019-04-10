exports.execute = async (client, arguments, message) => {
    var data = await client.db.query('SELECT * FROM moneys WHERE guild = $1', [message.guild.id]);
    var monneysList = '';
    if (data.rows.length == 0) {
        var mess = await client.translate('get-moneys.noMoneys', message.author.id);
        message.reply(mess);
        return;
    }
    data.rows.forEach((val) => {
        monneysList += '\n' + val.moneys;
    });
    var mess = await client.translate('get-moneys', message.author.id);
    message.reply(mess + '\n```' + monneysList + '```');
};