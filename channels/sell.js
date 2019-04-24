exports.execute = async (client, message) => {
    var argsDetector = /"(.*)" ([0-9]+) (.+)/g;
    var collDetector = /^"(.*)"\n/;
    var fields = [];
    if (message.content.match(argsDetector) == null) {
        var mess = await client.translate('sell.syntax', message.author.id);
        message.author.createDM().then((channel) => {
            channel.send(mess);
        });
        message.delete();
        return;
    }
    if (!message.content.match(collDetector)) {
        var id = client.db.query('SELECT id FROM articles ORDER BY id DESC LIMIT 1');
        //id = id.rows[0].id;
        id = 1;
        var moneys = await client.db.query('SELECT * FROM moneys WHERE guild = $1', [message.guild.id]);
        var mess = await client.translate('sell.money', message.author.id);
        message.content.match(argsDetector).forEach((el) => {
            var elDetector = /^"(.*)" (([0-9]+) (.+)*)$/;
            if (el.match(elDetector) == null) return;
            if (moneys.rows.find(ele => ele.moneys == el.match(elDetector)[4]) == undefined && moneys.rowCount != 0) {
                message.author.createDM().then((channel) => {
                    channel.send(mess);
                });
                return;
            }
            if (message.attachments.array()[0]) {
                var url = message.attachments.array()[0].url;
            } else {
                var url = '';
            }
            message.channel.send('', {"embed": {
                "title": el.match(elDetector)[1],
                "description": el.match(elDetector)[2] + "\nID : " + (eval(id) + 1),
                "image": {
                    "url": url
                },
                "author": {
                    "name": message.author.username,
                    "icon_url": message.author.avatarURL
                }
            }}).then((newMsg) => {
                client.db.query('INSERT INTO articles VALUES($1, $2, $3, $4, $5, $6, $7, $3, $8);', [el.match(elDetector)[1], el.match(elDetector)[2], message.author.id, message.guild.id, newMsg.id, newMsg.channel.id, newMsg.url, id]);
            });
            id++;
        });
    } else {
        if (message.attachments.array()[0]) {
            var url = message.attachments.array()[0].url;
        } else {
            var url = '';
        }
        var id = await client.db.query('SELECT id FROM articles ODER BY id DESC LIMIT 1');
        id = id.rows[0].id;
        message.channel.send('', {"embed": {
            "author": {
                "name": message.author.username,
                "icon_url": message.author.avatarURL
            }
        }}).then((newMsg) => {
            message.content.match(argsDetector).forEach((el) => {
                var elDetector = /^"(.*)" (([0-9]+) (.+)*)$/;
                if (el.match(elDetector) == null) return;
                if (message.attachments.array()[0]) {
                    var url = message.attachments.array()[0].url;
                } else {
                    var url = '';
                }
                fields.push({
                    "name": el.match(elDetector)[1],
                    "value": el.match(elDetector)[2] + "\nID : " + (eval(id) + 1)
                });
                client.db.query('INSERT INTO articles VALUES($1, $2, $3, $4, $5, $6, $7);', [el.match(elDetector)[1], el.match(elDetector)[2], message.author.id, message.guild.id, newMsg.id, message.channel.id, newMsg.url]);
                id++;
            });
            newMsg.edit('', {"embed": {
                "image": {
                    "url": url
                },
                "author": {
                    "name": message.author.username,
                    "icon_url": message.author.avatarURL
                },
                "fields": fields
            }});
        });
    }
    setTimeout(() => {
        message.delete();
        /*client.db.query('SELECT * FROM articles', [], (err, res) => {
            console.log(res.rows);
        });*/
    }, 1000);
};
