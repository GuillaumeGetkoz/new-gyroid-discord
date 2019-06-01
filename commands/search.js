exports.execute = async (client, arguments, message) => {
    var buy = require('./buy');
    buy.execute(client, message.content.replace('!market search ', ''));
};
