exports.execute = async (client, arguments, message) => {
    var buy = require('../channels/buy');
    message.content = message.content.replace('!market search ', '');
    buy.execute(client, message);
};
