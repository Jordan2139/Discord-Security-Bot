const { MessageEmbed } = require('discord.js');
const ms = require('ms')
exports.run = (client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`You are missing the permission(s) \`ADMINISTRATOR\`.`).catch(e => {});

    const someembedlol = new MessageEmbed()
    .setColor(client.config.colorhex)
    .setTitle(`Update Bans`)
    .setDescription(`Please confirm that you wish to update your guilds ban list to include all bans from our list.\n\n**Note:** This process may take awhile, and cannot be easily stopped or un-done.\n\n**Do you still wish to continue?**\n✅ - Yes, update bans.\n❌ - No, cancel command.`)
    .setThumbnail(`${client.user.displayAvatarURL()}`)
    .setTimestamp()
    .setFooter(`${client.config.copyright}`)

    message.channel.send(someembedlol).then(balls => {
        balls.react('✅').then(() => balls.react('❌'));
        const johncena = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.bot == false;
        };
        balls.awaitReactions(johncena, { max: 1, time: ms("25m")}).then(collected => {
            const react23847= collected.first();
            if(react23847.emoji.name === '✅') {
                message.channel.send(`Please Wait! We are beginning the process now...`).then(msg => {
                    msg.delete({ timeout: 10000 })
                    balls.delete()
                    message.delete()
                }).catch(e => {if(client.config.debugmode) return console.log(e);})
                setTimeout(() => {
                    con.query(`SELECT * FROM bannedusers`, async (err, row) => {
                        if(err) throw err;
                        for (let data of row) {
                            try {
                                message.guild.members.ban(`${data.userid}`, {
                                    reason: `${data.reason} - ${client.user.tag}`
                                });
                            } catch(e) {}        
                        }
                            let embedguild = message.guild
                            let theguild = client.guilds.cache.get(client.config.loggingguild)
                            let deChannel = theguild.channels.cache.get(client.config.updatebanslogs)
                            const embed = new MessageEmbed()
                            .setColor(client.config.colorhex)
                            .setTitle(`${message.guild.name} Updated Bans!`)
                            .setDescription(`**__Guild Info__**\n\n**Guild Name:** ${embedguild.name}\n**Guild ID:** ${embedguild.id}\n**Member(s):** ${embedguild.members.cache.size}\n\n**Runner Tag:** ${message.author.tag}\n**Runner ID:** ${message.author.id}`)
                            .setThumbnail(`${client.user.displayAvatarURL()}`)
                            .setTimestamp()
                            .setFooter(`${client.config.copyright}`)
                        
                            deChannel.send(embed).catch(err => {if(client.config.debugmode) return console.log(err);});

                        });
                }, 6000);
            }
            if(react23847.emoji.name === '❌') {
                return message.channel.send(`Cancelling update bans process...`).then(msg => {
                    msg.delete({ timeout: 10000 })
                    balls.delete()
                    message.delete()
                }).catch(e => {if(client.config.debugmode) return console.log(e);})
            }
        })
    }).catch(e => {if(client.config.debugmode) return console.log(e);});

}

exports.info = {
    name: "updatebans",
    description: "Update your servers bans to match those of the database!",
    useAliases: true,
    aliases: ['update']
}