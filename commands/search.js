exports.execute = async (client, arguments, message) => {
    var buy = require('../channels/buy');
    buy.execute(client, message.content.replace('!market search ', ''));
};
