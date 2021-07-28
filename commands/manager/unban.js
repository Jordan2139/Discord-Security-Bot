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
            await con.query(`SELECT * FROM bannedusers WHERE userid='${pingeduser}'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    await con.query(`DELETE FROM bannedusers WHERE userid='${pingeduser}'`, async (err, row) => {
                        if(err) throw err;
                        await con.query(`SELECT * FROM guilds WHERE active='true' AND autounbans='true'`, async (err, row) => {
                            if(err) throw err;
                            for(let data of row) {
                                let deGuild = await client.guilds.cache.get(data.guildid)
                                await deGuild.members.unban(pingeduser).catch(e => {})
                            }
                            await message.channel.send(`I have removed User ID: \`${pingeduser}\` from the banned users database.`).catch(e => {});
                        });
                    });
                } else if(!row[0]) {
                    return message.channel.send(`That user is not in the banned users database.`).catch(e => {});
                }
            });
        } else {
            return message.channel.send(`Only Bot Managers can use this command.`).catch(e => {});
        }
    });

}

exports.info = {
    name: "unban",
    description: "Remove a ban from the database!",
    useAliases: true,
    aliases: ['deleteban', 'removeban', 'revokeban']
}