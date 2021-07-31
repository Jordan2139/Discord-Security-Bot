# About The API

This API is used quite simply, it pulls data from the database and returns a JSON format.

It uses ExpressJS, along with MySQL.

```js
localhost:3000/                                         -- Grabs the API status & credits
localhost:3000/stats                                    -- Grabs the bots statistics
localhost:3000/cases/CASE_ID_HERE                       -- Grabs a provided case
localhost:3000/staff/STAFF_ID_HERE                      -- Grabs a provided staff user
localhost:3000/bans/USER_ID_HERE                        -- Grabs a banned user
localhost:3000/blacklists/USER_ID_HERE                  -- Grabs a blacklisted user
localhost:3000/guilds/GUILD_ID_HERE                     -- Grabs a guild
```
