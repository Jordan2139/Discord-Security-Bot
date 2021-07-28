exports.run = async (client, message, args, con) => {

    if(message.channel.type === 'dm') return message.channel.send(`Please only run commands in a Discord server.`).then(msg => {
        msg.delete({ timeout: 12000 })
    }).catch(e => {});

    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`You don't have permission to use this command.`).catch(e => {});

    await con.query(`SELECT * FROM sticky WHERE guild='${message.guild.id}' AND channel='${message.channel.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            await con.query(`DELETE FROM sticky WHERE guild='${message.guild.id}' AND channel='${message.channel.id}'`, async(err, row) => {
                if(err) throw err;
            });
            message.channel.send(`**Sticky Message Deleted!**`).catch(e => {});
        } else {
            message.channel.send(`**There is no sticky message in this channel.**`).catch(e => {});
        }
    });

}

exports.info = {
    name: "stickyremove",
    description: "Delete a sticky message.",
    useAliases: true,
    aliases: ['deletesticky', 'delsticky', 'removesticky', 'remsticky']
}