let i = 0;
const fs = require('fs')
const chalk = require('chalk');
const figlet = require('figlet');
const carden = require('carden');
const ms = require('ms')

module.exports = async(client, con, ready) => {

    try {

        // Presence Settings
        let presence = [
            {name: `${client.user.username}`, type: "PLAYING", status: "dnd"},
            {name: "s!help | s!setup", type: "LISTENING", status: "dnd"},
            {name: `${client.users.cache.size} users!`, type: "WATCHING", status: "dnd"},
            {name: `${client.guilds.cache.size} servers!`, type: "WATCHING", status: "dnd"}
        ];

        changeStatus(client, presence)

        figlet.text(`HDClient`, { width: '500 '}, async function(err, head) {
            if (err) return console.log(err);
            
            let commandcount = client.config.command_count;
            let eventcount = client.config.event_count;
            
            let frick = `${chalk.white(`Watching `)}${chalk.blue(client.guilds.cache.size)}${chalk.white(' guilds with ')}${chalk.blue(client.users.cache.size)}${chalk.white(' users!')}\n\n${chalk.white(`Client Tag: `)}${chalk.blue(client.user.tag)}\n${chalk.white(`Client ID: `)}${chalk.blue(client.user.id)}\n${chalk.white('Client Age: ')}${chalk.blue(client.user.createdAt.toLocaleString())}\n\n${chalk.white(`Main Prefix: `)}${chalk.blue(client.config.prefix)}${chalk.yellow(' (Default)')}\n${chalk.white(`Commands: `)}${chalk.blue(commandcount)}\n${chalk.white(`Events: `)}${chalk.blue(eventcount)}\n\n${chalk.white(`Created By: `)}${chalk.blue('Hyperz#0001')}\n${chalk.white('Debug Mode: ')}${chalk.yellow(client.config.debugmode)}`;

            let booter = carden(chalk.blue(head), frick, { margin: 1, content: { borderStyle: 'single', borderColor: "blue", padding: 1}, header: { borderStyle: 'classic', padding: 1}})
            console.log(booter);
            console.log(`\n\n    ------ CONSOLE LOGGING BEGINS BELOW ------\n\n`)
            console.log("Bot started successfully"); // Allows for docker ready event
        })

        await client.guilds.cache.forEach(async g => {
            await con.query(`SELECT * FROM guilds WHERE guildid='${g.id}'`, async(err, row) => {
                if(err) throw err
                if(row[0]) {
                    if(row[0].active === 'false') {
                        await con.query(`UPDATE guilds SET active='true' WHERE guildid='${g.id}'`, async(err, row) => {
                            if(err) throw err;
                        });
                    }
                } else {
                    await con.query(`INSERT INTO guilds (active, guildid, prefix, autobans, autounbans, altprev, altprevtimer, inviteblocker, serverlock) VALUES ('true', '${g.id}', '${client.config.prefix}', 'false', 'false', 'false', '30d', 'false', 'false')`, async (err, row) => {
                        if(err) throw err;
                    });
                }
            });
        });

        await con.query(`SELECT * FROM guilds`, async (err, row) => {
            if(err) throw err;
            await row.forEach(async r => {
                let deGuild = await client.guilds.cache.get(r.guildid)
                if(deGuild == undefined) {
                    await con.query(`UPDATE guilds SET active='false' WHERE guildid='${r.guildid}'`, async (err, row) => {
                        if(err) throw err;
                    });
                } else {
                    try {
                        if(deGuild.members.cache.find(client.user.id)) {
                            return;
                        } else {
                            await con.query(`UPDATE guilds SET active='false' WHERE guildid='${r.guildid}'`, async (err, row) => {
                                if(err) throw err;
                            });
                        }
                    } catch(e) {
                        
                    }
                }
            });
        });

        setTimeout(async () => {
            const channel = client.channels.cache.get(client.config.voicechanneltojoin);
            if (!channel) return console.error("The voice channel does not exist (change config's voicechanneltojoin)!");
            channel.join().then(connection => {
                console.log("Successfully connected to the voice channel!")
            }).catch(e => {
                console.error(e);
            });
        }, 2200);

    } catch(e) {
        console.log(e)
    }

}

async function changeStatus(client, presence) {
    if (i >= presence.length) i = 0;
    await client.user.setPresence({
        activity: {
            name: presence[i].name,
            type: presence[i].type
        },
        status: presence[i].status
    });
    i++;
    setTimeout(() => {
        changeStatus(client, presence);
    }, 10000)

};
