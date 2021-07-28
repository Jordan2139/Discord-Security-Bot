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
        .setDescription(`**Please state the Users ID.**`)

        const prompt1 = new Discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`**Please state the reason for the ban.**`)

        const prompt2 = new Discord.MessageEmbed()
        .setColor(client.config.colorhex)
        .setDescription(`**Please input an image link as evidence to backup the ban placed on this user.**`)

        try {
        message.channel.send(starter).then(async message => {
            message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
            .then(async collected => {
                
                let content1;
                content1 = collected.first().content

                await con.query(`SELECT * FROM bannedusers WHERE userid='${content1}'`, async (err, row) => {
                    if(err) throw err;
                    if(row[0]) {
                        return message.channel.send(`That user is already banned.`);
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
                                content3 = collected.first().content;
                                let test = await client.users.fetch(content1)
                                let founded = test.tag.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                let reason = content2
                                let image;

                                try {
                                    image = content3
                                } catch (e) {
                                    image = `${client.config.defaultimage}`
                                }
                                let refinedReason = reason.split("[")[0].replace("'", "").replace("`", "").replace("\\", "").replace(";", "")

                                const moment = require('moment');
                                let datetime = moment().format(client.config.date_format);

                            await con.query(`INSERT INTO bannedusers (userid, usertag, reason, proof, bandate) VALUES ('${content1}', "${founded}", '${refinedReason}', '${image}', '${datetime}')`, async(erro, rowo) => {
                                await con.query(`SELECT count(caseid) as total FROM cases`, async (errol, rowol) => {
                                    let banid = rowol[0].total + 1
                                    let atag = gmessage.author.tag.replace("'", "").replace("`", "").replace("\\", "").replace(";", "")
                                    await con.query(`INSERT INTO cases (caseid, caseuserid, caseusertag, casereason, enforcerid, enforcertag) VALUES ('${banid}', '${content1}', "${founded}", '${refinedReason}', '${message.author.id}', "${atag}")`, async(erroll, rowoll) => {
                                        await con.query(`UPDATE bannedusers SET caseid='${banid}' WHERE userid='${content1}'`, async (errolll, rowolll) => {
                                            if(errolll) throw errolll;
                                            const thecase = new Discord.MessageEmbed()
                                            .setColor(client.config.colorhex)
                                            .setTitle(`Ban Added!`)
                                            .setDescription(`**${founded}** was successfully banned!\n**Reason:** ${refinedReason}`)
                                            .setImage(`${image}`)
                                            .setTimestamp()
                                            .setFooter(`${client.config.copyright}`)
                                            message.channel.send(thecase).then(msg => {
                                                msg.delete({ timeout: 14000 })
                                            });

                                            const flippers = new Discord.MessageEmbed()
                                            .setColor(`${client.config.colorhex}`)
                                            .setTitle(`You Were Banned!`)
                                            .setDescription(`**Reason:** ${refinedReason}\n\n**You can appeal this ban [here](https://discord.gg/y94hgUe463)**`)
                                            .setThumbnail(`${client.user.displayAvatarURL()}`)
                                            .setImage(`${image}`)
                                            .setTimestamp()
                                            .setFooter(`${client.config.copyright}`)

                                            try {
                                                const founduser = client.users.cache.get(content1)
                                                founduser.send(flippers)
                                            } catch (e) {
                                                if (client.config.debugmode) return console.log(e);
                                            }

                                            // The Enforcer Shit
                                            let enfmember = content1;
                                            let enfreason = content2;
                                            let enfembed = new Discord.MessageEmbed()
                                            .setColor(client.config.colorhex)
                                            .setTitle(`Ban Hammer!`)
                                            .setDescription(`**Member:** ${founded} - (${content1})\n**Reason:** ${content2}\n**Case #:** ${banid}\n**Severity:** High\n**Ban Date:** ${datetime}`)
                                            .setTimestamp()
                                            .setImage(image)
                                            .setFooter(`${client.config.copyright}`);
                                            client.utils.enforcer(client, con, enfmember, enfreason, enfembed)
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

    } catch(e) {
        if(client.config.debugmode) return console.log(e);
    }

    } catch(e) {
        if(client.config.debugmode) return console.log(e);
    }

}

exports.info = {
    name: "ban",
    description: "This is a command for the owner of the bot...",
    useAliases: false,
    aliases: []
}