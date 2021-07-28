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
                return message.channel.send(`You don't have permission to use that command.`);
            }
        });

        const filter = m => m.author.id === message.author.id;

        const starter = new Discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`**Please provide the User ID of the user you wish to blacklist**\nEx. 704094587836301392`)

        const prompt1 = new Discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`**Please provide the reason you wish to blacklist this user with.**`)

        const prompt2 = new Discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`**Please send an image link as proof of this users offenses.**`)

        const prompt3 = new Discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`**Please provide any notes on the situation if you have any.**`)

        try {
        message.channel.send(starter).then(async message => {
            message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
            .then(async collected => {
                
                let content1;
                content1 = collected.first().content

                await con.query(`SELECT * FROM blacklistedusers WHERE userid='${content1}'`, async (err, row) => {
                    if(err) throw err;
                    if(row[0]) {
                        return message.channel.send(`That user is already blacklisted.`);
                    }
                });

                message.channel.send(prompt1).then(async message => {
                    message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                    .then(async collected => {
                        
                        let content2;
                        content2 = collected.first().content
        
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

                                        let image;
                                        try {
                                            image = content3
                                        } catch (e) {
                                            image = `${client.config.defaultimage}`
                                        }

                                        const moment = require('moment');
                                        let datetime = moment().format(client.config.date_format);

                                        await con.query(`INSERT INTO blacklistedusers (userid, caseid, reason, proof, notes) VALUES ('${content1}', 'cs', "${content2}", '${image}', "${content4}")`, async (err, row) => {
                                            if(err) throw err;
                                            await con.query(`SELECT count(caseid) as total FROM cases`, async (errol, rowol) => {
                                                let banid = rowol[0].total + 1
                                                let atag = gmessage.author.tag.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                                let test = await client.users.fetch(content1)
                                                let founduser = test.tag.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                                await con.query(`INSERT INTO cases (caseid, caseuserid, caseusertag, casereason, enforcertag, enforcerid) VALUES ('${banid}', '${content1}', '${founduser}', "${content2}", '${atag}', '${gmessage.author.id}')`, async (err, row) => {
                                                    if(err) throw err;
                                                    await con.query(`UPDATE blacklistedusers SET caseid='${banid}' WHERE userid='${content1}'`, async (err, row) => {
                                                        if(err) throw err;
                                                        const thecase = new Discord.MessageEmbed()
                                                        .setColor(client.config.colorhex)
                                                        .setTitle(`Blacklisted!`)
                                                        .setDescription(`**${founduser}** was successfully blacklisted!\n**Reason:** ${content2}`)
                                                        .setImage(`${image}`)
                                                        .setTimestamp()
                                                        .setFooter(`${client.config.copyright}`)
                                                        message.channel.send(thecase).then(msg => {
                                                            msg.delete({ timeout: 14000 })
                                                        });

                                                        // Logging the stuffs
                                                        await con.query(`SELECT * FROM loggingchannels WHERE type='1'`, async (err, row) => {
                                                            if(err) throw err;
                                                            if(row[0]) {
                                                                let mails = new Discord.MessageEmbed()
                                                                .setColor(client.config.colorhex)
                                                                .setTitle(`Blacklisted!`)
                                                                .setDescription(`**Member:** ${founduser} - (${content1})\n**Reason:** ${content2}\n**Case #:** ${banid}\n**Severity:** Medium\n**Date / Time:** ${datetime}`)
                                                                .setTimestamp()
                                                                .setImage(image)
                                                                .setFooter(`${client.config.copyright}`);
                                                                for(let data of row) {
                                                                    let deChannel = await client.channels.cache.get(data.channelid)
                                                                    deChannel.send(mails).catch(e => {});
                                                                }
                                                            }
                                                        });

                                                            const flipembed = new Discord.MessageEmbed()
                                                            .setColor(`${client.config.colorhex}`)
                                                            .setTitle(`You Were Blacklisted!`)
                                                            .setDescription(`**Reason:** ${content2}\n\n**You can appeal this ban [here](https://discord.gg/y94hgUe463)**`)
                                                            .setThumbnail(`${client.user.displayAvatarURL()}`)
                                                            .setImage(`${image}`)
                                                            .setTimestamp()
                                                            .setFooter(`${client.config.copyright}`)

                                                            try {
                                                                const founduser = client.users.cache.get(content1)
                                                                founduser.send(flipembed)
                                                            } catch (e) {
                                                                if (client.config.debugmode) return console.log(e);
                                                            }

                                                    });
                                                });
                                            });
                                        });
                        
                                    }).catch(e => {});
                                }).catch(e => {if(client.config.debugmode) return console.log(e);});
                
                            }).catch(e => {});
                        }).catch(e => {if(client.config.debugmode) return console.log(e);});
        
                    }).catch(e => {});
                }).catch(e => {if(client.config.debugmode) return console.log(e);});

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
    name: "blacklist",
    description: "Blacklist a user via the bot (owners only).",
    useAliases: false,
    aliases: []
}