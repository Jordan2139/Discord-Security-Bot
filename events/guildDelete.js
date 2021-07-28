module.exports = async(client, con, guild) => {

    await con.query(`SELECT * FROM guilds WHERE guildid='${guild.id}'`, async (err, row) => {
        if (err) throw err;
        if(row[0]) {
            await con.query(`UPDATE guilds SET active='false' WHERE guildid='${guild.id}'`, async (err, row) => {
                if(err) throw err;
            });
        }
    });

}