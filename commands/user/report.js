const { MessageEmbed } = require('discord.js');
const moment = require('moment');
exports.run = async (client, message, args, con) => {

    try {

        if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
            msg.delete({ timeout: 12000 })
        }).catch(e => {});

        message.delete().catch(e => {});

        if(!client.config.reports.enabled) return message.channel.send('This module is currently disabled.').then(msg => {
            msg.delete({ timeout: 12000 })
        }).catch(e => {if(client.config.debugmode) return console.log(e);});

        if(!client.config.reports.useBuiltInReports) return message.channel.send(`**Report Link:** [here](${client.config.reports.reportlink})`).then(msg => {
            msg.delete({ timeout: 12000 })
        }).catch(e => {if(client.config.debugmode) return console.log(e);});

        try {
            message.author.send(`**Report started below!**`).then(() => {
                message.channel.send(`**A report has been started in DMs!**`).then(msg => {
                    msg.delete({ timeout: 12000 })
                })
            });
        } catch(e) {
            console.log(e)
            return message.channel.send(`Please enable your dms!`).catch(e => {});
        }

        let gmessage = message
        const filter = m => m.author.id === message.author.id;

        const starter = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`Hello! Before we begin let me tell you a couple of things!\n\n1️. You're filling out a report form to request a ban on someone.\n2️. This form must be filled out **HONESTLY**.\n3️. This form is **NOT** promised that action will be taken on the user.\n4️. If you lie about a report, you will be **BANNED** from sending in future reports.\n\n Please send in chat **Yes** Or **No** if you agree to these terms.`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const prompt1 = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.reports.messages.prompt1}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const prompt2 = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.reports.messages.prompt2}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const prompt3 = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.reports.messages.prompt3}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const prompt4 = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.reports.messages.prompt4}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const prompt5 = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.reports.messages.prompt5}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const lastprompt = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.reports.messages.lastprompt}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        try {
        message.author.send(starter).then(async message => {

            message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
            .then(collected => {
                let newcol = collected.first().content.toLowerCase()
                if(newcol === "yes") { 
                try {
                    message.channel.send(prompt1).then(() => {
                        message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                        .then(async collected2 => {
                            let ress = collected2.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                            let holdtag= collected2.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                            await con.query(`SELECT count(uniqueid) as total FROM reports`, async (err, row) => {
                                const uniqueid = row[0].total + 1
                                let atag = gmessage.author.tag.replace("'", "").replace("`", "").replace("\\", "")
                                await con.query(`INSERT INTO reports (uniqueid, reporterid, reportertag, reportedtag) VALUES ('${uniqueid}', '${gmessage.author.id}', "${atag}", "${ress}")`, (err, row) => {
                                    try {
                                    message.channel.send(prompt2).then(() => {
                                        message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                        .then(async collected3 => {
                                            let ress = collected3.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                            let holdid = collected3.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                            await con.query(`SELECT * FROM bannedusers WHERE userid="${ress}"`, async (err, row) => {
                                                if(row[0]) return message.channel.send(`This user is already banned in our system, so there is no need to report them.`).then(() => {
                                                    con.query(`DELETE FROM reports WHERE uniqueid='${uniqueid}'`, (err, row) => {});
                                                });
                                            
                                            await con.query(`UPDATE reports SET reportedid="${ress}" WHERE uniqueid='${uniqueid}'`, (err, row) => {
                                                try {
                                                message.channel.send(prompt3).then(() => {
                                                    message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                                    .then(async collected4 => {
                                                        let ress = collected4.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                                        await con.query(`UPDATE reports SET reason="${ress}" WHERE uniqueid='${uniqueid}'`, (err, row) => {
                                                            try {
                                                            message.channel.send(prompt4).then(() => {
                                                                message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                                                .then(async collected4 => {
                                                                    let ress = collected4.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                                                    await con.query(`UPDATE reports SET links="${ress}" WHERE uniqueid='${uniqueid}'`, (err, row) => {
                                                                        try {
                                                                        message.channel.send(prompt5).then(() => {
                                                                            message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                                                            .then(async collected5 => {
                                                                                let ress = collected5.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                                                                await con.query(`UPDATE reports SET notes="${ress}" WHERE uniqueid='${uniqueid}'`, (err, row) => {
                                                                                    try {
                                                                                    message.channel.send(lastprompt).then(async () => {
                                                                                        message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                                                                        await con.query(`UPDATE reports SET active='true' WHERE uniqueid='${uniqueid}'`, async (err, row) => {

                                                                                            await con.query(`SELECT * FROM reports WHERE reportedid='${holdid}' AND active='true' AND uniqueid='${uniqueid}'`, async (err, row) => {
                                                                                                try {
                                                                                                const theguild = client.guilds.cache.get(client.config.loggingguild)
                                                                                                const chantosend = theguild.channels.cache.get(client.config.reportlogs)
                                                                                                let datetime = moment().format(client.config.date_format);

                                                                                                const logembed = new MessageEmbed()
                                                                                                .setColor(`${client.config.colorhex}`)
                                                                                                .setTitle(`New Report Against: ${holdtag}`)
                                                                                                .setDescription(`**Unique ID:** ${row[0].uniqueid}\n**Member:** ${holdtag} - (${row[0].reportedid})\n**Reason:** ${row[0].reason}\n**Links:** ${row[0].links}\n**Notes:** ${row[0].notes}\n\n**Submitted By:** ${row[0].reportertag} - (${row[0].reporterid})\n**Date Submitted:** ${datetime}\n\n**To Accept (ban):** \`${client.config.prefix}acceptreport ${row[0].uniqueid}\`\n**To Deny (don't ban):** \`${client.config.prefix}denyreport ${row[0].uniqueid}\``)
                                                                                                .setThumbnail(`${client.user.displayAvatarURL()}`)
                                                                                                .setTimestamp()
                                                                                                .setFooter(`${client.config.copyright}`)
                                                                                                chantosend.send(logembed).catch(e => {if(client.config.debugmode) return console.log(e);});
                                                                                                } catch(e) {
                                                                                                    if(client.config.debugmode) return console.log(e);
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                    }).catch(e => {});
                                                                                } catch(e) {
                                                                                    if(client.config.debugmode) return console.log(e);
                                                                                }
                                                                                })
                                                                            }).catch(e => {});
                                                                        }).catch(e => {});
                                                                    } catch(e) {
                                                                        if(client.config.debugmode) return console.log(e);
                                                                    }
                                                                    })
                                                                }).catch(e => {});
                                                            }).catch(e => {});
                                                        } catch(e) {
                                                            if(client.config.debugmode) return console.log(e);
                                                        }
                                                        })
                                                    }).catch(e => {});
                                                }).catch(e => {});
                                            } catch(e) {
                                                if(client.config.debugmode) return console.log(e);
                                            }
                                            })
                                        })
                                        }).catch(e => {});
                                    }).catch(e => {});
                                } catch(e) {
                                    if(client.config.debugmode) return console.log(e);
                                }
                                })
                            })
                        }).catch(e => {});
                    }).catch(e => {});
                } catch(e) {
                    if(client.config.debugmode) return console.log(e);
                }   
                } else if(newcol === "no") {
                    message.channel.send(`You are required to accept our terms to continue your report. Cancelling your report now...`).catch(e => {if(client.config.debugmode) return console.log(e);});
                } else {
                    message.channel.send(`That is an invalid response. Cancelling your report now...`).catch(e => {if(client.config.debugmode) return console.log(e);});
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
    name: "report",
    description: "Report a user to our system.",
    useAliases: false,
    aliases: []
}