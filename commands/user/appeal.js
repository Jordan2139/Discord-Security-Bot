const { MessageEmbed } = require('discord.js');
const moment = require('moment');
exports.run = async (client, message, args, con) => {

    try {

        if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
            msg.delete({ timeout: 12000 })
        }).catch(e => {});

        message.delete().catch(e => {});

        await con.query(`SELECT * FROM bannedusers WHERE userid='${message.author.id}'`, async (err, row) => {
            if(!row[0]) return message.channel.send(`You're not currently banned in our system, there-for you cannot submit an appeal.`).then(msg => {
                msg.delete({ timeout: 12000 })
            }).catch(e => {if(client.config.debugmode) return console.log(e);});
        });

        if(!client.config.appeals.enabled) return message.channel.send('This module is currently disabled.').then(msg => {
            msg.delete({ timeout: 12000 })
        }).catch(e => {if(client.config.debugmode) return console.log(e);});

        if(!client.config.appeals.useBuiltInAppeals) return message.channel.send(`**Appeal Link:** [here](${client.config.appeals.appeallink})`).then(msg => {
            msg.delete({ timeout: 12000 })
        }).catch(e => {if(client.config.debugmode) return console.log(e);});

        try {
            message.author.send(`**Appeal started below!**`).then(() => {
                message.channel.send(`**An appeal has been started in DMs!**`).then(msg => {
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
        .setDescription(`Hello! Before we begin let me tell you a couple things!\n\n1. This is an appeal for you to get globally unbanned.\n2. You are not guaranteed a unban.\n3. Do you understand if you bother any of our staff members to check your appeal you will automatically be denied!\n\nPlease send in chat **Yes** Or **No** if you agree to these terms.`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const prompt1 = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.appeals.messages.prompt1}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const prompt2 = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.appeals.messages.prompt2}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const prompt3 = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.appeals.messages.prompt3}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const prompt4 = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.appeals.messages.prompt4}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const prompt5 = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.appeals.messages.prompt5}`)
        .setTimestamp()
        .setFooter(`${client.config.copyright}`)

        const lastprompt = new MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`${client.config.appeals.messages.lastprompt}`)
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
                            await con.query(`SELECT count(uniqueid) as total FROM appeals`, async (err, row) => {
                                let uniqueid = row[0].total + 1
                                let atag = gmessage.author.tag.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                await con.query(`INSERT INTO appeals (uniqueid, userid, usertag, banreason) VALUES ('${uniqueid}', '${gmessage.author.id}', "${atag}", "${ress}")`, (err, row) => {
                                    try {
                                    message.channel.send(prompt2).then(() => {
                                        message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                        .then(async collected3 => {
                                            let ress = collected3.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                            
                                            await con.query(`UPDATE appeals SET unbanreason="${ress}" WHERE uniqueid='${uniqueid}'`, (err, row) => {
                                                try {
                                                message.channel.send(prompt3).then(() => {
                                                    message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                                    .then(async collected4 => {
                                                        let ress = collected4.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                                        await con.query(`UPDATE appeals SET sorry="${ress}" WHERE uniqueid='${uniqueid}'`, (err, row) => {
                                                            try {
                                                            message.channel.send(prompt4).then(() => {
                                                                message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                                                .then(async collected4 => {
                                                                    let ress = collected4.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                                                    await con.query(`UPDATE appeals SET mistakes="${ress}" WHERE uniqueid='${uniqueid}'`, (err, row) => {
                                                                        try {
                                                                        message.channel.send(prompt5).then(() => {
                                                                            message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                                                            .then(async collected5 => {
                                                                                let ress = collected5.first().content.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                                                                await con.query(`UPDATE appeals SET notes="${ress}" WHERE uniqueid='${uniqueid}'`, (err, row) => {
                                                                                    try {
                                                                                    message.channel.send(lastprompt).then(async () => {
                                                                                        message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                                                                        await con.query(`UPDATE appeals SET active='true' WHERE uniqueid='${uniqueid}'`, async (err, row) => {

                                                                                            await con.query(`SELECT * FROM appeals WHERE uniqueid='${uniqueid}' AND active='true' AND userid='${gmessage.author.id}'`, async (err, row) => {
                                                                                                if(err) {
                                                                                                    console.log(err)
                                                                                                }
                                                                                                try {
                                                                                                    const theguild = client.guilds.cache.get(client.config.loggingguild)
                                                                                                    const chantosend = theguild.channels.cache.get(client.config.appeallogs)
                                                                                                    let datetime = moment().format(client.config.date_format);

                                                                                                    const logembed = new MessageEmbed()
                                                                                                    .setColor(`${client.config.colorhex}`)
                                                                                                    .setTitle(`New Appeal From: ${row[0].usertag}`)
                                                                                                    .setDescription(`**Unique ID:** ${row[0].uniqueid}\n**Member:** ${row[0].usertag} - (${row[0].userid})\n\n**Ban Reason:** ${row[0].banreason}\n**Reason To Unban:** ${row[0].unbanreason}\n**Are you sorry:** ${row[0].sorry}\n**Learn From Mistakes:** ${row[0].mistakes}\n**Notes:** ${row[0].notes}\n\n**Date Submitted:** ${datetime}\n\n**To Accept:** \`${client.config.prefix}acceptappeal ${row[0].uniqueid}\`\n**To Deny:** \`${client.config.prefix}denyappeal ${row[0].uniqueid}\``)
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
                                                                                });
                                                                            }).catch(e => {});
                                                                        }).catch(e => {});
                                                                    } catch(e) {
                                                                        if(client.config.debugmode) return console.log(e);
                                                                    }
                                                                    });
                                                                }).catch(e => {});
                                                            }).catch(e => {});
                                                        } catch(e) {
                                                            if(client.config.debugmode) return console.log(e);
                                                        }6
                                                    }).catch(e => {});
                                                    
                                                }).catch(e => {});

                                            });
                                        } catch(e) {
                                            if(client.config.debugmode) return console.log(e);
                                        }
                                        });
                                        }).catch(e => {});
                                    }).catch(e => {});
                                } catch(e) {
                                    if(client.config.debugmode) return console.log(e);
                                }
                                });
                            });
                        }).catch(e => {});
                    }).catch(e => {});
                } catch(e) {
                    if(client.config.debugmode) return console.log(e);
                }
                        
                } else if(newcol === "no") {
                    message.channel.send(`You are required to accept our terms to continue your appeal. Cancelling your appeal now...`).catch(e => {if(client.config.debugmode) return console.log(e);});
                } else {
                    message.channel.send(`That is an invalid response. Cancelling your appeal now...`).catch(e => {if(client.config.debugmode) return console.log(e);});
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
    name: "appeal",
    description: "Appeal your ban from our system.",
    useAliases: false,
    aliases: []
}