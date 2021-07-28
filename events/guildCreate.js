module.exports = async(client, con, guild) => {

    await con.query(`SELECT * FROM guilds WHERE guildid='${guild.id}'`, async (err, row) => {
        if (err) throw err;
        if(row[0]) {
            await con.query(`UPDATE guilds SET active='true' WHERE guildid='${guild.id}'`, async (err, row) => {
                if(err) throw err;
            });
        } else {
            await con.query(`INSERT INTO guilds (active, guildid, prefix, autobans, autounbans, altprev, altprevtimer, inviteblocker, serverlock) VALUES ('true', '${guild.id}', '${client.config.prefix}', 'false', 'false', 'false', '30d', 'false', 'false')`, async (err, row) => {
                if(err) throw err;
            });
        }
    });

}