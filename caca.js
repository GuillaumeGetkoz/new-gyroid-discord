const Discord = require('discord.js');
const client = new Discord.Client();

var question = false;

client.on('message', (message) => {
	if (message.author.bot || message.system) return;

	if (message.content == '💩' && question == false) {
		message.reply('es-ce que tu aimes le caca ?');
		question = true;
	} else if (question == true) {
		if (message.content == 'oui') {
			var reponses = ['cool 😃 !', 'cool 😃 !', 'cool 😃 !', 'cool 😃 !', 'cool 😃 !', 'super 😃 !', 'super 😃 !', 'super 😃 !', 'super 😃 !', 'trop génial 😃 !', 'trop génial 😃 !', 'trop génial 😃 !', 'on est pareils 😃 !'];
			message.reply(reponses[Math.floor(Math.random() * reponses.length)]);
		} else {
			message.reply('j\'ai pas bien entendu...');
		}
		question = false;
	}
});

client.login('Njg4NDgyMzU3MDY5NjExMDE5.Xm09sw.M-0F0ZHRFHUAnbK3OKTgD66k5lA');
