const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    let embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(client.config.colorhex)
    .setDescription(`**Bot Invite:** [here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)\n**Support Server:** [here](${client.config.supportServerInvite})\n**Creators Server:** [here](https://hyperz.dev/discord)`)
    message.channel.send(embed).catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });
    message.delete().catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });

}

exports.info = {
    name: "invite",
    description: "Get the invite link to the bot.",
    useAliases: true,
    aliases: ['bot']
}