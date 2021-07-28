const { MessageEmbed } = require('discord.js');

exports.run = async(client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    let pingeduser;
    if(message.mentions.users.first()) {
        pingeduser = message.mentions.users.first().id
    } else if(!isNaN(args[0])) {
        pingeduser = args[0]
    } else {
        return message.channel.send(`I was unable to find that user.`).catch(e => {});
    }


    let founduser = await client.users.fetch(pingeduser)
    await con.query(`SELECT * FROM bannedusers WHERE userid='${pingeduser}'`, async(err, row) => {
        if(err) throw err;
        if(row[0]) {
            let embed = new MessageEmbed()
            .setColor(client.config.colorhex)
            .setTitle(`Ban Hammer!`)
           .setDescription(`**Member:** ${founduser.tag} - (${founduser.id})\n**Case Number:** ${row[0].caseid}\n**Reason:** ${row[0].reason}\n**Severity:** High\n**Image / Proof:**`)
            try {
                let image;
                if(row[0].proof === 'na') {
                    image = client.config.defaultimage
                } else {
                    image = row[0].proof
                }
                embed.setImage(image)
            } catch(e) {
                embed.setImage(client.config.defaultimage)
            }
            return message.channel.send(embed).catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });
        } else if(!row[0]) {
            let embed = new MessageEmbed()
            .setColor(client.config.colorhex)
            .setDescription(`**User ID: \`${pingeduser}\` is not banned.**`)
            setTimeout(() => {
                message.channel.send(embed).catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });
            }, 1100)
        }
    });

    await con.query(`SELECT * FROM blacklistedusers WHERE userid='${pingeduser}'`, async(err, row) => {
        if(err) throw err;
        if(row[0]) {
            let embed = new MessageEmbed()
            .setColor(client.config.colorhex)
            .setTitle(`Blacklisted!`)
            .setDescription(`**Member:** ${founduser.tag} - (${founduser.id})\n**Case Number:** ${row[0].caseid}\n**Reason:** ${row[0].reason}\n**Notes:** ${row[0].notes}\n**Severity:** Medium\n**Image / Proof:**`)
            try {
                embed.setThumbnail(client.user.avatarURL({ dynamic: true }))
                let image;
                if(row[0].proof === 'na') {
                    image = client.config.defaultimage
                } else {
                    image = row[0].proof
                }
                embed.setImage(image)
            } catch(e) {
                embed.setImage(client.config.defaultimage)
            }
            message.channel.send(embed).catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });
        } else {
            let embed = new MessageEmbed()
            .setColor(client.config.colorhex)
            .setDescription(`**User ID: \`${pingeduser}\` is not blacklisted.**`)
            message.channel.send(embed).catch(e => { if(client.config.debugmode) return client.utils.error(client, e) });
        }
    });

}

exports.info = {
    name: "check",
    description: "Check if a user is banned.",
    useAliases: true,
    aliases: ['find', 'search']
}