exports.execute = async (client, message) => {
    var data = await client.db.query('SELECT * FROM sellers WHERE member = $1 AND guild = $2', [message.author.id, message.guild.id]);
    data = data.rows;
    var wishlist = 'Ce vendeur n\'a pas encore d\'objets dans sa wishlist.';
    var comments = 'Ce vendeur n\'a pas encore reçu de commentaires.';
    var valuation = 0;
    var starLogo = 'star';
    var stars = 0;
    var starw = 'étoiles';
    var valength = 0;
    var moy = '(pas encore de note)';
    if (data.length == 0) {
        client.db.query('INSERT INTO sellers VALUES($1, $2, \'{}\', \'{}\', 0, 0);', [message.author.id, message.guild.id]);
    } else {
        data = data[0];
        if (data.wishlist && data.wishlist.length > 0) {
            wishlist = '';
            data.wishlist.forEach((val) => {
                wishlist += val + '\n';
            });
        }
        var valuations = await client.db.query('SELECT * FROM valuations WHERE seller = $1 AND guild = $2', [message.author.id, message.guild.id]);
        valuations = valuations.rows;
        if (valuations.length > 0) {
            var i = 0;
            comments = '';
            var o = valuations.length;
            valength = valuations.length;
            valuations.forEach((val) => {
                i++;
                valuation = eval(valuation + ' + ' + val.note);
                if (val.star == true) {
                    var astar = ' + étoile';
                } else {
                    var astar = '';
                }
                o--;
                if (o >= 5) return;
                comments += '**' + val.comment + '**\n<@' + val.author + '> 🞄 a noté ' + val.note + '/5' + astar + '\n\n';
            });
            valuation = valuation / i;
            moy = Math.floor(valuation) + '/5';
            if (stars >= 10) {
                starLogo = 'star2';
            } else if (stars >= 30) {
                starLogo = 'dizzy';
            }
            if (data.stars) {
                stars = data.stars.length;
            }
            if (stars == 1) {
                starw = 'étoile';
            }
        }
    }
    return {
        "title": ":" + starLogo + ":  **" + stars + " " + starw + "**",
        "description": "Nombre d\'articles vendus : " + valength + "\nNote moyenne : " + moy,
        "author": {
            "name": message.author.username,
            "icon_url": message.author.avatarURL
        },
        "fields": [
        {
            "name": "Wishlist :",
            "value": wishlist
        },
        {
            "name": "Commentaires :",
            "value": comments
        }
        ]
    };
};