const chalk = require('chalk');

async function colorize(color, content) {
    switch (color, content) {
        case "red":
            return chalk.red(content)
        case "green":
            return chalk.green(content)
        case "yellow":
            return chalk.yellow(content)
        case "blue":
            return chalk.blue(content)
        case "cyan":
            return chalk.cyan(content)
        case "white":
            return chalk.white(content)
        case "black":
            return chalk.black(content)
        default:
            return chalk.white(content);
    };
};

async function error(client, content) {
    if(client.config.debugmode) {
        console.log(chalk.red(content))
    }
};

async function guildload(client, con, message) {
    await con.query(`INSERT INTO guilds (active, guildid, prefix, autobans, autounbans, altprev, altprevtimer, inviteblocker, serverlock) VALUES ('true', '${message.guild.id}', '${client.config.prefix}', 'false', 'false', 'false', '30d', 'false', 'false')`, async (err, row) => {
        if(err) throw err;
    });
};

async function enforcer(client, con, enfmember, enfreason, enfembed) {
    await con.query(`SELECT * FROM guilds WHERE active='true'`, async (err, row) => {
        if(err) throw err;
        for(let data of row) {
            await con.query(`SELECT * FROM loggingchannels WHERE guildid='${data.guildid}' AND type='1'`, async (err, rows) => {
                if(err) throw err;
                for(let datas of rows) {
                    let deChannel = await client.channels.cache.get(datas.channelid)
                    deChannel.send(enfembed).catch(e => {});
                }
            });
        }
    });

    await con.query(`SELECT * FROM guilds WHERE autobans='true' AND active='true'`, async (err, row) => {
        if(err) throw err;
        for(let data of row) {
            let deGuild = await client.guilds.cache.get(data.guildid)
            await deGuild.members.ban(enfmember, {
                reason: `${enfreason} - ${client.user.tag}`
            }).catch(e => {});
        }
    });
}

exports.enforcer = enforcer;
exports.guildload = guildload;
exports.error = error;
exports.colorize = colorize;