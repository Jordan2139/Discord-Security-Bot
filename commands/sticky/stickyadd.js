const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    await con.query(`SELECT * FROM sticky WHERE channel='${message.channel.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            return message.channel.send(`There is already a sticky message in this channel.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {});
        }
    });

    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`You don't have permission to use this command.`).catch(e => {});

    const filter = m => m.author.id === message.author.id;

    const build1 = new MessageEmbed()
    .setColor(`${client.config.colorhex}`)
    .setDescription(`**Welcome to the Sticky Message Builder!**\n**Type **\`end\`** to end the builder.**`)

    const build2 = new MessageEmbed()
    .setColor(`${client.config.colorhex}`)
    .setDescription(`**Please provide a channel for the sticky message to be placed in.**`)

    const build3 = new MessageEmbed()
    .setColor(`${client.config.colorhex}`)
    .setDescription(`**Would you like this message to be embeded?\nPlease choose** \`yes\` **or** \`no\``)

    const build4 = new MessageEmbed()
    .setColor(`${client.config.colorhex}`)
    .setDescription(`**Please provide a color HEX for the embed.**`)

    const build5 = new MessageEmbed()
    .setColor(`${client.config.colorhex}`)
    .setDescription(`**Please enter the message you would like the sticky message to say.**`)

    const build6 = new MessageEmbed()
    .setColor(`${client.config.colorhex}`)
    .setDescription(`**Sticky Message Created!**`)

    message.channel.send(build1).catch(e => {});

    message.channel.send(build2).then(() => {
        message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
        .then(collected => {
            let newcol = collected.first().content.toLowerCase()
            if(newcol === 'end') return message.channel.send(`**Sticky Message Builder Ended.**`).catch(e => {});
            let deChan;
            if(collected.first().mentions.channels.first()) {
                deChan = collected.first().mentions.channels.first().id
            } else if(!isNaN(collected.first().content)) {
                deChan = collected.first().content
            }
            message.channel.send(build3).then(() => {
                message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                .then(collected => {
                    let newcol = collected.first().content.toLowerCase()
                    if(newcol === 'end') return message.channel.send(`**Sticky Message Builder Ended.**`).catch(e => {});
                    let content3 = collected.first().content.toLowerCase()

                    if(content3 === 'yes') {
                        let embedf = 'true'
                        message.channel.send(build4).then(() => {
                            message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                            .then(collected => {
                                let newcol = collected.first().content.toLowerCase()
                                if(newcol === 'end') return message.channel.send(`**Sticky Message Builder Ended.**`).catch(e => {});
                                let content4 = collected.first().content
            
                                message.channel.send(build5).then(async () => {
                                    message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                                    .then(async collected => {
                                        let newcol = collected.first().content.toLowerCase()
                                        if(newcol === 'end') return message.channel.send(`**Sticky Message Builder Ended.**`).catch(e => {});
                                        let content5 = collected.first().content
                                        
                                        await con.query(`INSERT INTO sticky (guild, channel, message, embed, color) VALUES ('${message.guild.id}', '${deChan}', '${content5}', '${embedf}', '${content4}')`, async (err, row) => {
                                            if(err) {
                                                console.log(err)
                                            }
                                        }); 

                                        message.channel.send(build6).catch(e => {});
                    
                                    }).catch(e => {})
                                }).catch(e => {})
            
                            }).catch(e => {})
                        }).catch(e => {})
                    } else if(content3 === 'no') {
                        let embedf = 'false'
                        message.channel.send(build5).then(async() => {
                            message.channel.awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                            .then(async collected => {
                                let newcol = collected.first().content.toLowerCase()
                                if(newcol === 'end') return message.channel.send(`**Sticky Message Builder Ended.**`).catch(e => {});
                                let content5 = collected.first().content
                                await con.query(`INSERT INTO sticky (guild, channel, message, embed, color) VALUES ('${message.guild.id}', '${deChan}', '${content5}', '${embedf}', 'na')`, async (err, row) => {
                                    if(err) {
                                        console.log(err)
                                    }
                                }); 
                                message.channel.send(build6).catch(e => {});
            
                            }).catch(e => {})
                        }).catch(e => {})
                    } else {
                        return message.channel.send(`Invalid entry, please choose \`yes\` or \`no\`\n**Builder Cancelled.**`).catch(e => {});
                    }

                }).catch(e => {})
            }).catch(e => {})
        }).catch(e => {})
    }).catch(e => {})
    
}

exports.info = {
    name: "stickyadd",
    description: "Add a sticky message.",
    useAliases: true,
    aliases: ['addsticky', 'newsticky', 'stickynew', 'stickycreate', 'createsticky']
}