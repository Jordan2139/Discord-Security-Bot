// This API was pulled from a previous project, the original repository can be found below
// https://github.com/Jordan2139/HypeBanDB-API
// Yeah, i make good stuff <3 - Jordan.#2139

const chalk = require('chalk')
const express = require('express')
const app = express()

function apistart(client, con) {
    setTimeout(async () => {
    app.listen(client.config.clientAPI.port, null, null, () => console.log(chalk.blue(`API is up and running on port ${client.config.clientAPI.port}.`)));

        // Ready
        app.get('/', (req, res) => {
            res.json({ status: `API is up and running on port ${client.config.clientAPI.port}.`, MadeBy: "Jordan.#2139 & Hyperz#0001, With Some Help From JipyTheDev#0001"})
        }) 

        // Statistics
        app.get('/stats', function(req, res) { // Stats api
            res.set('Access-Control-Allow-Origin', '*');
            con.query(`SELECT COUNT(*) as total FROM bannedusers`, (erro, rowo) => {
                con.query(`SELECT COUNT(caseid) as total FROM cases`, (errol, rowol) => {
                    res.send({ 'guilds': client.guilds.cache.size, 'banned': rowo[0].total, 'cases': rowol[0].total })
                })
            })
        })

        // Case Checking (Via case ID)
        app.get(`/cases/:caseID`, async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            const caseid = await req.params.caseID
            con.query(`SELECT * FROM cases WHERE caseid="${caseid}"`, async(err, row) => {
                if (err) throw err;
                if (row[0]) {
                    res.send({
                        'number': row[0].caseid,
                        'enforcertag': row[0].enforcertag,
                        'enforcerid': row[0].enforcerid,
                        'usertag': row[0].caseusertag,
                        'userid': row[0].caseuserid,
                        'reason': row[0].casereason
                    })
                } else {
                    res.send({
                        'error': 'Not a valid case ID',
                    })
                }
            });
        })

        // Staff DB (see if user is staff on the bot)   
        app.get(`/staff/:userID`, async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            const userid = await req.params.userID
            con.query(`SELECT * FROM staff WHERE userid="${userid}"`, async(err, row) => {
                if (err) throw err;
                if (row[0]) {
                    res.send({
                        'isStaff': true,
                        'usertag': row[0].usertag,
                        'userid': row[0].userid,
                    })
                } else {
                    res.send({
                        'isStaff': false
                    })
                }
            });
        })

        // Ban viewing
        app.get(`/bans/:userID`, async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            const userid = await req.params.userID
            con.query(`SELECT * FROM bannedusers WHERE userid="${userid}"`, async(err, row) => {
                if (err) throw err;
                if (row[0]) {
                    res.send({
                        'banned': true,
                        'usertag': row[0].usertag,
                        'userid': row[0].userid,
                        'caseid': row[0].caseid,
                        'reason': row[0].reason,
                        'proof': row[0].proof,
                        'bandate': row[0].bandate
                    })
                } else {
                    res.send({
                        'banned': false
                    })
                }
            });
        })

        // Blacklist viewing
        app.get(`/blacklists/:userID`, async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            const userid = await req.params.userID
            con.query(`SELECT * FROM blacklistedusers WHERE userid="${userid}"`, async(err, row) => {
                if (err) throw err;
                if (row[0]) {
                    res.send({
                        'blacklisted': true,
                        'caseid': row[0].caseid,
                        'userid': row[0].userid,
                        'reason': row[0].reason,
                        'proof': row[0].proof,
                        'notes': row[0].notes
                    })
                } else {
                    res.send({
                        'blacklisted': false
                    })
                }
            });
        })

        // Guild viewing
        app.get(`/guilds/:guildID`, async function(req, res) {
            res.set('Access-Control-Allow-Origin', '*');
            const guildid = await req.params.guildID
            con.query(`SELECT * FROM guilds WHERE guildid="${guildid}"`, async(err, row) => {
                if (err) throw err;
                if (row[0]) {
                    res.send({
                        'indb': true,
                        'active': row[0].active,
                        'guildid': row[0].guildid,
                        'prefix': row[0].prefix,
                        'autobans': row[0].autobans,
                        'autounbans': row[0].autounbans,
                        'altprev': row[0].altprev,
                        'altprevtimer': row[0].altprevtimer,
                        'inviteblocker': row[0].inviteblocker,
                        'serverlock': row[0].serverlock
                    })
                } else {
                    res.send({
                        'indb': false
                    })
                }
            });
        })
    }, 3000)
}

module.exports = {
    apistart: apistart
}

// This API was pulled from a previous project, the original repository can be found below
// https://github.com/Jordan2139/HypeBanDB-API
