const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`You are missing the permission(s) \`ADMINISTRATOR\`.`).catch(e => {});

    await con.query(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`, async(err, row) => {
        if(err) throw err;
        if(row[0]) {
            if(row[0].serverlock === 'true') {
                await con.query(`UPDATE guilds SET serverlock='false' WHERE guildid='${message.guild.id}'`, async (err, row) => {
                    if(err) throw err;
                    message.channel.send(`**Sever Lockdown Toggled:** \`false\``).catch(e => {});
                });
            } else if(row[0].serverlock === 'false') {
                await con.query(`UPDATE guilds SET serverlock='true' WHERE guildid='${message.guild.id}'`, async (err, row) => {
                    if(err) throw err;
                    message.channel.send(`**Sever Lockdown Toggled:** \`true\``).catch(e => {});
                });
            }
        }
    });

}

exports.info = {
    name: "serverlock",
    description: "Lock the server down!",
    useAliases: true,
    aliases: ['lockserver', 'serverlockdown', 'lockdownserver']
}