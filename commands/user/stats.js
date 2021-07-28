const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    con.query(`SELECT COUNT(*) as total FROM bannedusers`, async (err, row) => {
        if(err) throw err;
        let embed = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setTitle(`${client.user.username} Statistics`)
        .setDescription(`**Guild Count:** ${client.guilds.cache.size}\n**User Count:** ${client.users.cache.size}\n**Banned Count:** ${row[0].total}\n\n**Ping / Latency:** ${Date.now() - message.createdTimestamp}ms.\n**Creator:** [@Hyperz](https://hyperz.dev/discord)`)
        try { embed.setThumbnail(message.guild.iconURL({ dynamic: true })) } catch(e) {}
        message.channel.send(embed).catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });
        message.delete().catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });

    });
}

exports.info = {
    name: "stats",
    description: "Check the bots statistics.",
    useAliases: false,
    aliases: []
}