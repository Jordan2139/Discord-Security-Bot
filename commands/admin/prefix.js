const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`You don't have permission to use this command.`).catch(e => {});

    if(!args[0]) return message.channel.send(`**Please include a new prefix in your message.**`).catch(e => {});
    if(args[1]) return message.channel.send(`**Your prefix cannot include a space.**`).catch(e => {});

    await con.query(`UPDATE guilds SET prefix='${args[0]}' WHERE guildid='${message.guild.id}'`, async(err, row) => {
        if(err) throw err;
    });

    let embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(client.config.colorhex)
    .setDescription(`**Your guilds prefix has been updated to \`${args[0]}\`**`)
    message.channel.send(embed).catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });

}

exports.info = {
    name: "prefix",
    description: "Set your guilds prefix.",
    useAliases: true,
    aliases: ['setprefix']
}