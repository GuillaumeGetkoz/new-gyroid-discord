exports.execute = (client, arguments, message) => {
    var argsDetector = /^<@!?([0-9]+)>$/;
    if (arguments.match(argsDetector) == null) {
        message.reply('Oups, il semeblerait que votre syntaxe ne soit pas bonne. Veuillez juste mentionner la personne dont vous voulez récupérer le profil.');
        return;
    }
    var profile = require('../profiles-commands/post');
    var msg = message;
    client.fetchUser(arguments.match(argsDetector)[1]).then((user) => {
        msg.author = user;
        profile.execute(client, msg);
    });
};