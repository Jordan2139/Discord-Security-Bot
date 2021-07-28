let i = 0;
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args, con) => {

    try {

        con.query(`SELECT * FROM staff WHERE userid='${message.author.id}'`, async (err, row) => {
            if (!row.length) return message.channel.send(`You don't have permissions to use this command.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => { if (client.config.debugmode) return console.log(e); });

            if(!client.config.appeals.enabled) return message.channel.send(`This module is disabled.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {if(client.config.debugmode) return console.log(e);});

            if(!client.config.appeals.useBuiltInAppeals) return message.channel.send(`This module is disabled.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {if(client.config.debugmode) return console.log(e);});

        if(!args[0]) return message.channel.send(`Please define an appeal ID to accept.`).then(msg => {
            msg.delete({ timeout: 12000 })
            message.delete()
        }).catch(e => {if(client.config.debugmode) return console.log(e);});

        con.query(`SELECT * FROM appeals WHERE uniqueid="${args[0]}" AND active='true'`, (err, row) => {
            if(err) return console.log(err);
            if(!row[0]) {
                message.channel.send(`That appeal was either inactive, or I was unable to find it.`)
            } else {
                let deUser = row[0].userid
                con.query(`SELECT * FROM bannedusers WHERE userid='${row[0].userid}'`, (err, row) => {

                    if (err) return message.channel.send(`Something went wrong when removing that user to the system.`).then(msg => {
                        msg.delete({ timeout: 12000 })
                        message.delete()
                        if (client.config.debugmode) return console.log(err);
                    }).catch(e => { if (client.config.debugmode) return console.log(e); });
    
                    if (!row.length) {
                        message.channel.send(`That user is not in the database.`).then(msg => {
                            msg.delete({ timeout: 12000 })
                            message.delete()
                        });
                    } else {
    
                        let founduser = client.users.cache.get(row[0].userid)
                        if (!founduser) return message.channel.send(`I was unable to find that user.`).then(msg => {
                            msg.delete({ timeout: 12000 })
                            message.delete()
                        }).catch(e => { if (client.config.debugmode) return console.log(e); });
    
                        con.query(`DELETE FROM bannedusers WHERE userid='${row[0].userid}' `, async(erro, rowo) => {
    
                            const thecase = new MessageEmbed()
                                .setColor(client.config.colorhex)
                                .setTitle(`Ban Removed!`)
                                .setDescription(`**${founduser.tag}** was successfully un-banned!`)
                                .setThumbnail(`${client.user.displayAvatarURL()}`)
                                .setTimestamp()
                                .setFooter(`${client.config.copyright}`)
                            message.channel.send(thecase).then(msg => { msg.delete({ timeout: 12000 }) }).catch(e => { if (client.config.debugmode) return console.log(e); });
    
                            con.query(`SELECT * FROM loggingchannels;`, async function(error, rows) {
                                if (error) throw error;
                                con.query(`SELECT * FROM bannedusers WHERE userid='${deUser}'`, async function(err, res) {
                                    if (err) throw err;
                                    const banned = new MessageEmbed()
                                        .setColor(`${client.config.colorhex}`)
                                        .setTitle(`Ban Revoked!`)
                                        .setDescription(`User <@${deUser}> (${founduser.tag}) has been unbanned!.\nTheir case ID still exists in our database.`)
                                        .setThumbnail(`${client.user.displayAvatarURL()}`)
                                        .setTimestamp()
                                        .setFooter(`${client.config.copyright}`)
                                    for (let data of rows) {
                                        let channel = client.channels.cache.find(c => c.id === data.channelid);
                                        if (channel) channel.send(banned).catch(() => {});
                                    };
                                    con.query(`SELECT * FROM guilds WHERE autounbans='true' AND active='true'`, async(err, row) => {
                                        if (err) throw err;
                                        con.query(`UPDATE appeals SET active='fase' WHERE uniqueid="${args[0]}"`, (err, row) => {});
                                        for (let data of row) {
                                            let guild = client.guilds.cache.find(g => g.id === data.id);
                                            if (guild) guild.members.unban(deUser).catch(() => {});
                                        };
                                    });
                                    try {
                                        let someuser = client.users.cache.get(deUser)
                                        const embed = new MessageEmbed()
                                        .setTitle(`Appeal Accepted!`)
                                        .setColor(`${client.config.colorhex}`)
                                        .setThumbnail(`${client.user.displayAvatarURL()}`)
                                        .setDescription("Your appeal was accepted!\nAny servers with auto-unbans toggled `true` you will be un-banned in.")
                                        .setTimestamp()
                                        .setFooter(`${client.config.copyright}`)

                                        someuser.send(embed).catch(e => {if(client.config.debugmode) return console.log(e);});
                                        message.delete().catch(e => {if(client.config.debugmode) return console.log(e);});
                                    } catch(e) {}
                                });
                            });
    
                        });
                    }
                });    

            }

        });
    });
    } catch(e) {
        console.log(e)
    }
}


exports.info = {
    name: "acceptappeal",
    description: "This is a command for the owner of the bot...",
    useAliases: true,
    aliases: ['appealaccept']
}