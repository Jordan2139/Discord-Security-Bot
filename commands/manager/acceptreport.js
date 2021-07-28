let i = 0;
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args, con) => {

    try {

        con.query(`SELECT * FROM staff WHERE userid='${message.author.id}'`, async (err, row) => {
            if (!row.length) return message.channel.send(`You don't have permissions to use this command.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => { if (client.config.debugmode) return console.log(e); });

            if(!client.config.reports.enabled) return message.channel.send(`This module is disabled.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {if(client.config.debugmode) return console.log(e);});

            if(!client.config.reports.useBuiltInReports) return message.channel.send(`This module is disabled.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {if(client.config.debugmode) return console.log(e);});

        if(!args[0]) return message.channel.send(`Please define a report ID to accept.`).then(msg => {
            msg.delete({ timeout: 12000 })
            message.delete()
        }).catch(e => {if(client.config.debugmode) return console.log(e);});

        con.query(`SELECT * FROM reports WHERE uniqueid="${args[0]}" AND active='true'`, (err, row) => {
            if(err) return console.log(err);
            if(!row[0]) {
                message.channel.send(`That report was either inactive, or I was unable to find it.`)
            } else {
                let deUser = row[0].reportedid
                const moment = require('moment');
                let datetime = moment().format(client.config.date_format);

                const question = new MessageEmbed()
                .setColor(`${client.config.colorhex}`)
                .setDescription(`**What is the final ban reason?**`)
                .setTimestamp()
                .setFooter(`${client.config.copyright}`)

                const filter = m => m.author.id === message.author.id;

                message.channel.send(question).then((mnmnnrp) => {
                    message.channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
                    .then(async collected2 => {
                        let reason = collected2.first().content

                        var image;

                        try {
                            image = reason.split("[")[1].replace("]", "");
                        } catch (e) {
                            image = `${client.config.defaultimage}`
                        }

                        var refinedReason = reason.split("[")[0].replace("'", "").replace("`", "").replace("\\", "").replace(";", "")

                    await con.query(`INSERT INTO bannedusers (userid, usertag, reason, proof, bandate) VALUES ('${row[0].reportedid}', "${row[0].reportedtag}", '${refinedReason}', '${image}', '${datetime}')`, async(erro, rowo) => {

                        await con.query(`SELECT count(caseid) as total FROM cases`, async (errol, rowol) => {
                            let banid = rowol[0].total + 1
                            let atag = message.author.tag.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                            await con.query(`INSERT INTO cases (caseid, caseuserid, caseusertag, casereason, enforcerid, enforcertag) VALUES ('${banid}', '${row[0].reportedid}', "${row[0].reportedtag}", '${refinedReason}', '${message.author.id}', "${atag}")`, async(erroll, rowoll) => {

                                await con.query(`UPDATE bannedusers SET caseid='${banid}' WHERE userid='${row[0].reportedid}'`, async (errolll, rowolll) => {

                                    await con.query(`UPDATE reports SET active='false' uniqueid="${args[0]}"`, async (errollll, rowollll) => {

                                    const thecase = new MessageEmbed()
                                        .setColor(client.config.colorhex)
                                        .setTitle(`Ban Added!`)
                                        .setDescription(`**${row[0].reportedtag}** was successfully banned!\n**Reason:** ${refinedReason}`)
                                        .setImage(`${image}`)
                                        .setTimestamp()
                                        .setFooter(`${client.config.copyright}`)
                                    message.channel.send(thecase).then(msg => { msg.delete({ timeout: 12000 }) }).catch(e => { if (client.config.debugmode) return console.log(e); });
                                    message.delete().catch(e => { if (client.config.debugmode) return console.log(e); });

                                    try {

                                        setTimeout(function() {

                                            // PlutoTheDev#1000's Better Logging System (if you're reading this, I'm actually gay)
                                        
                                            con.query(`SELECT * FROM loggingchannels;`, async function(error, rows) {
                                                if (error) throw error;
                                                con.query(`SELECT * FROM bannedusers WHERE userid='${row[0].reportedid}'`, async function(err, res) {
                                                    if (err) throw err;
                                                    let deMember = await client.users.fetch(res[0].userid)
                                                    const banned = new MessageEmbed()
                                                        .setColor(client.config.colorhex)
                                                        .setTitle(`Ban Hammer!`)
                                                        .setDescription(`**Member:** ${deMember.tag} - (${res[0].userid})\n**Reason:** ${res[0].reason}\n**Case #:** ${res[0].caseid}\n**Severity:** High\n**Ban Date:** ${res[0].bandate}`)
                                                        .setTimestamp()
                                                        .setFooter(`${client.config.copyright}`)
                                                    try { banned.setImage(`${res[0].proof}`) } catch {};
                                                    for (let data of rows) {
                                                        let channel = client.channels.cache.find(c => c.id === data.channelid);
                                                        if (channel) channel.send(banned).catch(() => {});
                                                    };
                                                    con.query(`SELECT * FROM guilds WHERE autobans='true' AND active='true'`, async(err, row) => {
                                                        if (err) throw err;

                                                        for (let data of row) {
                                                            let guild = client.guilds.cache.find(g => g.id === data.id);
                                                            if (guild) guild.members.ban(`${res[0].userid}`, {
                                                                reason: `${res[0].reason} - ${client.user.tag}`
                                                            });
                                                        };
                                                    });
                                                });
                                            });
                                            
                                                    const embed = new MessageEmbed()
                                                    .setColor(`${client.config.colorhex}`)
                                                    .setTitle(`You Were Banned!`)
                                                    .setDescription(`**Reason:** ${refinedReason}\n\n**You can appeal this ban [here](https://hyperz.dev/discord)**`)
                                                    .setThumbnail(`${client.user.displayAvatarURL()}`)
                                                    .setImage(`${image}`)
                                                    .setTimestamp()
                                                    .setFooter(`${client.config.copyright}`)

                                                    try {
                                                        const founduser = client.users.cache.get(row[0].reportedid)
                                                        founduser.send(embed)
                                                    } catch (e) {
                                                        if (client.config.debugmode) return console.log(e);
                                                    }
                                        }, 3000);

                                        

                                    } catch (e) {
                                        if (client.config.debugmode) return console.log(e);
                                    }
                            });
                        });
                        });      
                    });
                        try {
                            con.query(`SELECT * FROM reports WHERE uniqueid='${args[0]}'`, async (err, newrow) => {

                                    let someuser = client.users.cache.get(newrow[0].reporterid)
                                    const embed = new MessageEmbed()
                                    .setTitle(`Report Accepted!`)
                                    .setColor(`${client.config.colorhex}`)
                                    .setThumbnail(`${client.user.displayAvatarURL()}`)
                                    .setDescription("Your report was accepted!\nAny servers with auto-bans toggled `true` they will be banned in.")
                                    .setTimestamp()
                                    .setFooter(`${client.config.copyright}`)

                                    someuser.send(embed).catch(e => {if(client.config.debugmode) return console.log(e);});
                                    message.delete().catch(e => {if(client.config.debugmode) return console.log(e);});

                            });
                        } catch(e) {
                            if(client.config.debugmode) return console.log(e);
                        }
                                });

                            });
                            mnmnnrp.delete({ timeout: 14000 }).catch(err => {})
                        });
                    }
                    
        });
    });
    } catch(e) {
        console.log(e)
    }
}


exports.info = {
    name: "acceptreport",
    description: "This is a command for the owner of the bot...",
    useAliases: true,
    aliases: ['reportaccept']
}