const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    let pingeduser;
    if(message.mentions.users.first()) {
        pingeduser = message.mentions.users.first().id
    } else if(!isNaN(args[0])) {
        pingeduser = args[0]
    }

    let checker = await client.users.fetch(pingeduser)

    if(checker == undefined) return message.channel.send(`I was unable to find that user.`);

    await con.query(`SELECT * FROM staff WHERE userid='${message.author.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            await con.query(`SELECT * FROM blacklistedusers WHERE userid='${pingeduser}'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    await con.query(`DELETE FROM blacklistedusers WHERE userid='${pingeduser}'`, async (err, row) => {
                        if(err) throw err;
                        message.channel.send(`I have removed User ID: \`${pingeduser}\` from the blacklisted users database.`).catch(e => {});
                    });
                } else if(!row[0]) {
                    return message.channel.send(`That user is not in the blacklisted users database.`).catch(e => {});
                }
            });
        } else {
            return message.channel.send(`Only Bot Managers can use this command.`).catch(e => {});
        }
    });

}

exports.info = {
    name: "unblacklist",
    description: "Remove a blacklist from the database!",
    useAliases: true,
    aliases: ['deleteblacklist', 'removeblacklist', 'revokeblacklist']
}