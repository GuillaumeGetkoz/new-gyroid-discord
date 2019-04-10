exports.execute = async (client, message) => {
	var argsDetector = /^(.*)\n?([0-9]*) ?(.*)$/;
	var title = '';
	var description = '';
	if (message.content.match(argsDetector) == null) {
    	message.author.createDM().then((channel) => {
    		channel.send('Oups, il semblerait que votre syntaxe ne soit pas bonne.');
    	});
    	message.delete();
    	return;
    }
    if (message.content.match(argsDetector)[2] != '') {
        var results = await client.db.query('SELECT * FROM articles WHERE name LIKE $1 AND price BETWEEN $2 AND $3', ['%' + message.content.match(argsDetector)[1] + '%', '0 ' + message.content.match(argsDetector)[3], message.content.match(argsDetector)[2] + ' ' + message.content.match(argsDetector)[3]]);
    } else {
        var results = await client.db.query('SELECT * FROM articles WHERE name LIKE $1', ['%' + message.content.match(argsDetector)[1] + '%']);
    }
    var fields = [];
    if (results.rows.length == 0) {
        var mess1 = await client.translate('buy.noRes1', message.author.id);
        var mess2 = await client.translate('buy.noRes2', message.author.id);
        title = mess1;
        description = mess2 + '\n```!market add-wishlist "' + message.content.match(argsDetector)[1] + '"```';
    } else {
        var mess1 = await client.translate('buy.1', message.author.id);
        var mess2 = await client.translate('buy.2', message.author.id);
        var mess3 = await client.translate('buy.3', message.author.id);
        var mess4 = await client.translate('buy.4', message.author.id);
        title = mess1 + ' "' + message.content.match(argsDetector)[1] + '"';
        description = fields.length + ' ' + mess2;
        results.rows.forEach((val) => {
            fields.push({
                "name": val.name,
                "value": mess3 + " : <@" + val.author + ">\n" + val.price + "ID : " + val.id + "\n[" + mess4 + "](" + val.link + ")"
            });
        });
    }
    message.channel.send('', {"embed": {
    	"title": title,
    	"description": description,
    	"fields": fields
  	}});
	var results = null;
};