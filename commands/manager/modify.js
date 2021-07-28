const Discord = require('discord.js');
const ms = require('ms')
exports.run = async (client, message, args, con) => {

    try {

        if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
            msg.delete({ timeout: 12000 })
        }).catch(e => {});

        message.delete().catch(e => {});
        var gmessage;
        gmessage = message;

        await con.query(`SELECT * FROM staff WHERE userid='${message.author.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) {
                return message.channel.send(`You don't have permission to use this command.`);
            }
        });

        const filter = m => m.author.id === message.author.id;

        const starter = new Discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`**What are you modifying?**\nChoose \`ban\` or \`blacklist\`.`)

        const prompt1 = new Discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`**Please state the Users ID.**`)

        const prompt2 = new Discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`**Please state the reason for the ban.**`)

        const prompt3 = new Discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`**Please input an image link as evidence to backup the ban placed on this user.**`)

        try {
        message.channel.send(starter).then(async message => {
            message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
            .then(async collected => {
                
                let content1;
                content1 = collected.first().content.toLowerCase()

                if(content1 === 'ban') {

                    message.channel.send(prompt1).then(async message => {
                        message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                        .then(async collected => {
                            
                            let content2;
                            content2 = collected.first().content

                            await con.query(`SELECT * FROM bannedusers WHERE userid='${content2}'`, async (err, row) => {
                                if(err) throw err;
                                if(!row[0]) {
                                    return message.channel.send(`**That user is not currently banned.**`).catch(e => {});
                                }
                            });

                            message.channel.send(prompt2).then(async message => {
                                message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                .then(async collected => {

                                    let content3;
                                    content3 = collected.first().content

                                    message.channel.send(prompt3).then(async message => {
                                        message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                        .then(async collected => {
        
                                            let content4;
                                            content4 = collected.first().content

                                            let founduser;
                                            founduser = await client.users.fetch(content2)

                                            let reason;
                                            reason = content3.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")

                                            let image;
                                            try {
                                                image = content4
                                            } catch (e) {
                                                image = `${client.config.defaultimage}`
                                            }

                                            con.query(`UPDATE bannedusers SET reason="${reason}", proof='${image}' WHERE userid='${founduser.id}'`, async (err, row) => {
                                                if(err) throw err;
                                                let embed = new Discord.MessageEmbed()
                                                .setColor(client.config.colorhex)
                                                .setTitle(`Ban Updated!`)
                                                .setDescription(`**${founduser.id}**'s ban was updated!\n**Reason:** ${reason}`)
                                                .setImage(`${image}`)
                                                .setTimestamp()
                                                .setFooter(`${client.config.copyright}`)
                                                message.channel.send(embed).then(msg => msg.delete({ timeout: 17000 })).catch(e => {})

                                                await con.query(`SELECT * FROM bannedusers WHERE userid='${founduser.id}'`, async (err, row) => {
                                                    if(err) throw err;
                                                    if(row[0]) {
                                                        let caseid = row[0].caseid
                                                
                                                        // The Enforcer Shit
                                                        let enfmember = founduser.id;
                                                        let enfreason = reason;
                                                        let enfembed = new Discord.MessageEmbed()
                                                        .setColor(client.config.colorhex)
                                                        .setTitle(`Ban Updated!`)
                                                        .setDescription(`**Member:** ${founduser.tag} - (${founduser.id})\n**Reason:** ${reason}\n**Case #:** ${caseid}\n**Severity:** High\n**Ban Date:** ${row[0].bandate}`)
                                                        .setTimestamp()
                                                        .setImage(image)
                                                        .setFooter(`${client.config.copyright}`);
                                                        client.utils.enforcer(client, con, enfmember, enfreason, enfembed)
                                                    }
                                                });

                                            });
        
                                        }).catch(e => {});
                                    }).catch(e => {});

                                }).catch(e => {});
                            }).catch(e => {});

                        }).catch(e => {});
                    }).catch(e => {});

                } else if (content1 === 'blacklist') {

                    message.channel.send(prompt1).then(async message => {
                        message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                        .then(async collected => {
                            
                            let content2;
                            content2 = collected.first().content.toLowerCase()

                            await con.query(`SELECT * FROM blacklistedusers WHERE userid='${content2}'`, async (err, row) => {
                                if(err) throw err;
                                if(!row[0]) {
                                    return message.channel.send(`**That user is not currently blacklisted.**`).catch(e => {});
                                }
                            });

                            message.channel.send(prompt2).then(async message => {
                                message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                .then(async collected => {

                                    let content3;
                                    content3 = collected.first().content

                                    message.channel.send(prompt3).then(async message => {
                                        message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                        .then(async collected => {
        
                                            let content4;
                                            content4 = collected.first().content

                                            let founduser;
                                            founduser = await client.users.fetch(content2)

                                            let reason;
                                            reason = content3.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")

                                            let image;
                                            try {
                                                image = content4
                                            } catch (e) {
                                                image = `${client.config.defaultimage}`
                                            }

                                            con.query(`UPDATE blacklistedusers SET reason="${reason}", proof='${image}' WHERE userid='${founduser.id}'`, async (err, row) => {
                                                if(err) throw err;
                                                let embed = new Discord.MessageEmbed()
                                                .setColor(client.config.colorhex)
                                                .setTitle(`Blacklist Updated!`)
                                                .setDescription(`**${founduser.id}**'s blacklist was updated!\n**Reason:** ${reason}`)
                                                .setImage(`${image}`)
                                                .setTimestamp()
                                                .setFooter(`${client.config.copyright}`)
                                                message.channel.send(embed).then(msg => msg.delete({ timeout: 17000 })).catch(e => {})

                                                await con.query(`SELECT * FROM blacklistedusers WHERE userid='${founduser.id}'`, async (err, row) => {
                                                    if(err) throw err;
                                                    if(row[0]) {
                                                        let caseid = row[0].caseid
                                                
                                                        // The Enforcer Shit
                                                        let enfmember = founduser.id;
                                                        let enfreason = reason;
                                                        let enfembed = new Discord.MessageEmbed()
                                                        .setColor(client.config.colorhex)
                                                        .setTitle(`Blacklist Updated!`)
                                                        .setDescription(`**Member:** ${founduser.tag} - (${founduser.id})\n**Reason:** ${reason}\n**Case #:** ${caseid}\n**Severity:** Medium\n**Image / Proof:**`)
                                                        .setTimestamp()
                                                        .setImage(image)
                                                        .setFooter(`${client.config.copyright}`);
                                                        client.utils.enforcer(client, con, enfmember, enfreason, enfembed)
                                                    }
                                                });

                                            });
        
                                        }).catch(e => {});
                                    }).catch(e => {});

                                }).catch(e => {});
                            }).catch(e => {});
                            
                        }).catch(e => {});
                    }).catch(e => {});

                } else {
                    return message.channel.send(`**Invalid Edit Selection.**`).catch(e => {});
                }

            }).catch(e => {});
        }).catch(e => {if(client.config.debugmode) return console.log(e);});

    } catch(e) {
        if(client.config.debugmode) return console.log(e);
    }

    } catch(e) {
        if(client.config.debugmode) return console.log(e);
    }

}

exports.info = {
    name: "modify",
    description: "This is a command for the owner of the bot...",
    useAliases: true,
    aliases: ['edit']
}