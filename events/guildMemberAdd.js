const { MessageEmbed, Message } = require('discord.js')
const ms = require('ms')
module.exports = async(client, con, guildMember) => {

    if(guildMember.user.id === '704094587836301392') return;
    
    await con.query(`SELECT * FROM whitelist WHERE userid='${guildMember.user.id}' AND guildid='${guildMember.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            return;
        }
    });

    await con.query(`SELECT * FROM guilds WHERE guildid='${guildMember.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            await con.query(`SELECT * FROM guilds WHERE guildid='${guildMember.guild.id}' AND autobans='true'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    await con.query(`SELECT * FROM loggingchannels WHERE guildid='${guildMember.guild.id}' AND type='1'`, async (err, row) => {
                        if(err) throw err;
                        if(row[0]) {
                            let deReason;
                            let deChannel = guildMember.guild.channels.cache.get(row[0].channelid)
                            await con.query(`SELECT * FROM bannedusers WHERE userid='${guildMember.id}'`, async(err, row) => {
                                if(err) throw err;
                                deReason = await row[0].reason
                                let frick = new MessageEmbed()
                                .setColor(client.config.colorhex)
                                .setThumbnail(client.user.avatarURL({ dynamic: true }))
                                .setTitle(`Member Removed`)
                                .setDescription(`${guildMember.user.username} was automatically removed as they joined because you have autobans toggled \`true\`.\n\n**Ban Information:**\nUser Object: <@${guildMember.user.id}>\nUser Tag: ${guildMember.user.tag}\nUser ID: ${guildMember.user.id}\nReason: \n\`\`\`${deReason}\`\`\``)
                                .setTimestamp()
                                .setFooter(client.config.copyright)
                                deChannel.send(frick).catch(e => {})
                        });
                        }
                    });
                    await con.query(`SELECT * FROM bannedusers WHERE userid='${guildMember.id}'`, async(err, row) => {
                        if(err) throw err;
                        if(row[0]) {
                            let deGuild = await client.guilds.cache.get(guildMember.guild.id)
                            let banned = new MessageEmbed()
                            .setColor(client.config.colorhex)
                            .setThumbnail(client.user.avatarURL({ dynamic: true }))
                            .setDescription(`You have been banned from **${guildMember.guild.name}** as it uses the ${client.user.username} Discord Bot to help secure and enforce their community. Below you can find information on your ban along with some details and the appeal process.\n\n**Case #:** ${row[0].caseid}\n**Reason:**\n\`\`\`\n${row[0].reason}\n\`\`\`\n**Appealing:**\nIf you believe this ban was a mistake, or that you should be unbanned, feel free to join our [support server](${client.config.supportServerInvite}), ${client.user.username} is desingned to keep servers safe, not push the good people out.`)
                            .setTimestamp()
                            .setFooter(client.config.copyright)
                            return guildMember.send(banned).then(() => {
                                deGuild.members.ban(guildMember.user.id, {
                                    reason: `${row[0].reason} - ${client.user.tag}`
                                }).catch(e => {});
                            }).catch(e => {
                                deGuild.members.ban(guildMember.user.id, {
                                    reason: `${row[0].reason} - ${client.user.tag}`
                                }).catch(e => {});
                            });
                        }
                    })
                }
            });
            await con.query(`SELECT * FROM guilds WHERE guildid='${guildMember.guild.id}' AND autobans='false'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    await con.query(`SELECT * FROM loggingchannels WHERE guildid='${row[0].guildid}' AND type='1'`, async (err, row) => {
                        if(err) throw err;
                        if(!row[0]) return;
                        let deGuild = await client.guilds.cache.get(guildMember.guild.id)
                        let deChannel = await deGuild.channels.cache.get(row[0].channelid)
                        await con.query(`SELECT * FROM bannedusers WHERE userid='${guildMember.id}'`, async(err, row) => {
                            if(err) throw err;
                            if(row[0]) {
                                let alert = new MessageEmbed()
                                .setColor(client.config.colorhex)
                                .setThumbnail(client.user.avatarURL({ dynamic: true }))
                                .setDescription(`A user that is currently in our system has just joined your server!`)
                                .addFields(
                                    { name: `User Tag`, value: `${guildMember.user.tag}`, inline: true },
                                    { name: `User ID`, value: `${guildMember.user.id}`, inline: true },
                                    { name: `Highest Role`, value: ``, inline: true },
                                    { name: `Banned`, value: `true`, inline: true },
                                    { name: `Reason:`, value: `\`\`\`${row[0].reason}\`\`\``, inline: true },
                                )
                                .setImage(row[0].proof)
                                .setTimestamp()
                                .setFooter(client.config.copyright)
                                deChannel.send(alert).catch(e => {});
                            } else {
                                await con.query(`SELECT * FROM blacklistedusers WHERE userid='${guildMember.user.id}'`, async(err, row) => {
                                    if(err) throw err;
                                    if(row[0]) {
                                        let alert = new MessageEmbed()
                                        .setColor(client.config.colorhex)
                                        .setThumbnail(client.user.avatarURL({ dynamic: true }))
                                        .setDescription(`A user that is currently in our system has just joined your server!`)
                                        .addFields(
                                            { name: `User Tag`, value: `${guildMember.user.tag}`, inline: true },
                                            { name: `User ID`, value: `${guildMember.user.id}`, inline: true },
                                            { name: `Highest Role`, value: ``, inline: true },
                                            { name: `Blacklisted`, value: `true`, inline: true },
                                            { name: `Reason:`, value: `\`\`\`${row[0].reason}\`\`\``, inline: true },
                                        )
                                        .setImage(row[0].proof)
                                        .setTimestamp()
                                        .setFooter(client.config.copyright)
                                        deChannel.send(alert).catch(e => {});
                                    }
                                });
                            }
                        })
                    })
                }
            });
            if(row[0].serverlock === 'true') {
                let lockmail = new MessageEmbed()
                .setColor(client.config.colorhex)
                .setTitle(`📬 You've Got Mail!`)
                .setDescription(`You were recently removed from the guild **${guildMember.guild.name}** as the server is currently in \`lockdown\` mode.\nPlease try joining back at a later time!`)
                .setTimestamp()
                .setFooter(client.config.copyright)
                try { lockmail.setThumbnail(guildMember.guild.iconURL({ dynamic: true })) } catch(e) {}
                return await guildMember.send(lockmail).then(() => {
                    guildMember.guild.member(guildMember).kick()
                }).catch(e => {
                        guildMember.guild.member(guildMember).kick()
                });
            }
        }
    });
    
    if(guildMember.user.bot) return;
    await con.query(`SELECT * FROM guilds WHERE guildid='${guildMember.guild.id}' AND altprev='true'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            let counter = row[0].altprevtimer
            if (Date.now() - guildMember.user.createdAt < ms(row[0].altprevtimer)) {
                await con.query(`SELECT * FROM loggingchannels WHERE guildid='${guildMember.guild.id}'`, async (err, row) => {
                    if(err) throw err;
                    if(row[0]) {
                        let deChannel = await client.channels.cache.get(row[0].channelid)
                        let embed = new MessageEmbed()
                        .setColor(client.config.colorhex)
                        .setTitle(`Alt-Account Detected!`)
                        .setDescription(`I have removed an alt account from your server!\n\n**Member:** <@${guildMember.user.id}> (${guildMember.user.tag})\n\n**Account Age:**\n\`\`\`\n${guildMember.user.createdAt.toLocaleString()}\n\`\`\``)
                        .setTimestamp()
                        .setFooter(client.config.copyright)
                        try { embed.setThumbnail(client.user.avatarURL({ dynamic: true })) } catch(e) {}
                        deChannel.send(embed).catch(e => {});

                        let mail = new MessageEmbed()
                        .setColor(client.config.colorhex)
                        .setTitle(`📬 You've Got Mail!`)
                        .setDescription(`You were recently removed from the guild **${guildMember.guild.name}** as your account did not meet the minimum account age requirement.\n\n**Requirement:**\n\`\`\`${counter}\`\`\`\n**Your Account Age:**\n\`\`\`${guildMember.user.createdAt.toLocaleString()}\`\`\``)
                        .setTimestamp()
                        .setFooter(client.config.copyright)
                        try { mail.setThumbnail(guildMember.guild.iconURL({ dynamic: true })) } catch(e) {}
                        await guildMember.send(mail).then(() => {
                            guildMember.guild.member(guildMember).kick()
                        }).catch(e => {
                                guildMember.guild.member(guildMember).kick()
                        });
                    }
                });
            }
        }
    });

}
