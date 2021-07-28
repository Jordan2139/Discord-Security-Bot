const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    let embed = new MessageEmbed()
    .setColor(client.config.colorhex)
    .setDescription(`🏓 Latency is: **${Date.now() - message.createdTimestamp}ms.**`)
    message.channel.send(embed).then(msg => msg.delete({ timeout: 12000 })).catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });
    message.delete().catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });

}

exports.info = {
    name: "ping",
    description: "See if im alive!",
    useAliases: true,
    aliases: ['bing']
}