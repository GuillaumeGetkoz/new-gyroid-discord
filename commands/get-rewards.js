exports.execute = async (client, arguments, message) => {
    var data = await client.db.query('SELECT * FROM rewards WHERE guild = $1', [message.guild.id]);
    var rewardsList = '';
    if (data.rows.length == 0) {
        var mess = await client.translate('get-rewards.noRewards', message.author.id);
        message.reply(mess);
        return;
    }
    data = data.rows;
    var messStar = await client.translate('star', message.author.id);
    var messStars = await client.translate('stars', message.author.id);
    data.forEach((val) => {
        var starw = messStars;
        if (val.stars == 1) {
            starw = messStar;
        }
        rewardsList += '\n' + val.stars + ' ' + starw + ' : ' + message.guild.roles.get(val.role).name;
    });
    var mess = await client.translate('get-rewards', message.author.id);
    message.reply(mess + ' :\n```' + rewardsList + '```');
};