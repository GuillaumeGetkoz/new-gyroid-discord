exports.execute = async (client, arguments, message) => {
    var argsDetector = /^<@!?([0-9]+)>$/;
    if (arguments.match(argsDetector) == null) {
        message.reply('Oups, il semeblerait que votre syntaxe ne soit pas bonne. Veuillez juste mentionner le vendeur dont vous voulez obtenir le profil.');
        return;
    }
    var command = require('../profiles-commands/create');
    var msg = message;
    msg.author = await client.fetchUser(arguments.match(argsDetector)[1]);
    var result = await command.execute(client, msg);
    message.reply('', {embed: result});
};