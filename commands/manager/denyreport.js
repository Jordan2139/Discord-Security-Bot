const { MessageEmbed } = require('discord.js')
exports.run = async (client, message, args, con) => {

    try {

        con.query(`SELECT * FROM staff WHERE userid='${message.author.id}'`, async (err, row) => {
            if (!row.length) return message.channel.send(`You don't have permissions to use this command.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => { if (config.main_config.debugmode) return console.log(e); });

            if(!client.config.reports.enabled) return message.channel.send(`This module is disabled.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {if(client.config.debugmode) return console.log(e);});

            if(!client.config.reports.useBuiltInReports) return message.channel.send(`This module is disabled.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {if(client.config.debugmode) return console.log(e);});

        if(message.channel.type === "dm") return;
        if(!args[0]) return message.channel.send(`Please define a report ID to deny.`).then(msg => {
            msg.delete({ timeout: 12000 })
            message.delete()
        }).catch(e => {if(client.config.debugmode) return console.log(e);});

        if(!args[1]) return message.channel.send(`Please define a reason for denial.`).then(msg => {
            msg.delete({ timeout: 12000 })
            message.delete()
        }).catch(e => {if(client.config.debugmode) return console.log(e);});

        con.query(`SELECT * FROM reports WHERE uniqueid='${args[0]}' AND active='true'`, (err, row) => {
            if(err) return console.log(err);
            if(!row[0]) {
                message.channel.send(`That report was either inactive, or I was unable to find it.`)
            } else {
                con.query(`UPDATE reports SET active='false' WHERE uniqueid='${args[0]}'`, (err, row) => {});
                let someuser = client.users.cache.get(row[0].reporterid)
                if(!someuser) return;
                const embed = new MessageEmbed()
                .setTitle(`Report Denied!`)
                .setColor(`${client.config.colorhex}`)
                .setThumbnail(`${client.user.displayAvatarURL()}`)
                .setDescription(`Your report was denied!\n**Reason:** ${args.slice(1).join(" ")}`)
                .setTimestamp()
                .setFooter(`${client.config.copyright}`)

                someuser.send(embed).catch(e => {if(client.config.debugmode) return console.log(e);});
                message.channel.send(`Report denied`).then(msg => {
                    msg.delete({ timeout: 10000 })
                });
                message.delete().catch(e => {if(client.config.debugmode) return console.log(e);});
            }

        });
    });
    } catch(e) {
        if(client.config.debugmode) return console.log(e);
    }
}

exports.info = {
    name: "denyreport",
    description: "This is a command for the owner of the bot...",
    useAliases: true,
    aliases: ['reportdeny']
}