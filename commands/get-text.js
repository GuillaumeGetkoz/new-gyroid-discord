exports.execute = async (client, arguments, message) => {
    var mess = await client.translate('noAdmin', message.author.id);
    message.reply(mess);
};
