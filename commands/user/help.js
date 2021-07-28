const { MessageEmbed } = require('discord.js');
const { readdirSync} = require('fs');
const { join } = require('path');

exports.run = (client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    message.delete().catch(e => {});

    if(!args[0]) {
        helpEmbed(client, message, MessageEmbed)
    } else {
        if(args[0].toLowerCase() === 'user') {
            let embed = new MessageEmbed()
            .setColor(client.config.colorhex)
            .setTitle(`User Commands`)
            .setDescription("`check` - See if a user has a record with us.\n`report` - File a report against a user.\n`appeal` - Appeal a ban / blacklist on yourself.\n`ping` - Pings the bot.\n`credits` - Find out who made the bot.\n`invite` - Get an invite for the bot.\n`stats` - check the bots statistics.")
            message.channel.send(embed).then(msg => {
                msg.delete({ timeout: 22000 })
            }).catch(e => {});
        } else if(args[0].toLowerCase() === 'admin') {
            let embed = new MessageEmbed()
            .setColor(client.config.colorhex)
            .setTitle(`Admin Commands`)
            .setDescription("`prefix` - Set the bots prefix for your guild.\n`setup` - Set the bot up in your guild.\n`serverlock` - Lockdown your guild / server.\n`embed` - Use our handy embed builder.\n`whitelist` - Add a user to the whitelist.\n`unwhitelist` - Remove a user from the whitelist.\n`updatebans` - Update your bans to match our bans list.\n")
            message.channel.send(embed).then(msg => {
                msg.delete({ timeout: 22000 })
            }).catch(e => {});
        } else if(args[0].toLowerCase() === 'manager') {
            let embed = new MessageEmbed()
            .setColor(client.config.colorhex)
            .setTitle(`Manager Commands`)
            .setDescription("`ban` - Add a user to the database.\n`unban` - Remove a user from the database.\n`blacklist` - Add a user to the flagged users list.\n`unblacklist` - Remove a user from the flagged users list.\n`acceptreport` - Accept a report.\n`denyreport` - Deny a report.\n`acceptappeal` - Accept an appeal.\n`denyappeal` - Deny an appeal.\n`staffadd` - Add a user to the bot managers list.\n`staffremove` - Remove a user from the saff managers list.\n")
            message.channel.send(embed).then(msg => {
                msg.delete({ timeout: 22000 })
            }).catch(e => {});
        } else if(args[0].toLowerCase() === 'utility') {
            let embed = new MessageEmbed()
            .setColor(client.config.colorhex)
            .setTitle(`Utility Commands`)
            .setDescription("`stickyadd` - Add a sticky message to a channel.\n`stickyremove` - Remove a sticky message from a channel.\n")
            message.channel.send(embed).then(msg => {
                msg.delete({ timeout: 22000 })
            }).catch(e => {});
        } else {
            let embed = new MessageEmbed()
            .setColor(client.config.colorhex)
            .setDescription("**Error: Invalid Command Category.**")
            message.channel.send(embed).then(msg => {
                msg.delete({ timeout: 22000 })
            }).catch(e => {});
        }
    }

}

exports.info = {
    name: "help",
    description: "View all commands and info about the bot!",
    useAliases: true,
    aliases: ['commands']
}

async function helpEmbed(client, message, MessageEmbed) {
    let embed = new MessageEmbed()
    .setColor(client.config.colorhex)
    .setTitle(`${client.user.username} Help Menu`)
    .setDescription(`**What is ${client.user.username}?**\n${client.user.username} is a Discord bot that utilizes the DiscordJS API to focus on keeping your server safe from users, trolls, attacks, and more!\n\n**Command Categories:**\n\`user\`  \`admin\`  \`manager\` \`utility\`\n\`\`\`s!help category\`\`\`\n**Credits:**\n[@Hyperz](https://hyperz.dev/discord) - *Head Programmer*`)
    .setThumbnail(message.author.avatarURL({ dynamic: true }))
    .setTimestamp()
    .setFooter(client.config.copyright)
    message.channel.send(embed).catch(e => client.utils.error(client, e))
};

async function commandEmbed(client, message, args, MessageEmbed, cinfo) {
    let embed = new MessageEmbed()
    .setColor(client.config.colorhex)
    .setTitle(`Command Help`)
    .setDescription(`**Name:** \`${cinfo.info.name}\`\n**Description:** \`${cinfo.info.description}\`\n**useAliases:** \`${cinfo.info.useAliases}\`\n**Aliases:** \`${cinfo.info.aliases}\`\n`)
    .setThumbnail(message.author.avatarURL({ dynamic: true }))
    .setTimestamp()
    .setFooter(client.config.copyright)
    message.channel.send(embed).catch(e => client.utils.error(client, e))
};