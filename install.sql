CREATE TABLE guilds (
    active varchar(255),
    guildid varchar(255),
    prefix varchar(255),
    autobans varchar(255),
    autounbans varchar(255),
    altprev varchar(255),
    altprevtimer varchar(255),
    inviteblocker varchar(255),
    serverlock varchar(255)
);

CREATE TABLE whitelist (
    guildid varchar(255),
    userid varchar(255),
    enforcerid varchar(255)
);

CREATE TABLE blacklistedusers (
    userid varchar(255),
    caseid varchar(255),
    reason TEXT,
    proof TEXT,
    notes TEXT
);

CREATE TABLE bannedusers (
    usertag varchar(255),
    userid varchar(255),
    caseid varchar(255),
    reason text,
    proof text,
    bandate varchar(255)
);

CREATE TABLE cases (
    caseid varchar(255),
    caseuserid varchar(255),
    caseusertag varchar(255),
    casereason text,
    enforcertag varchar(255),
    enforcerid varchar(255)
);

CREATE TABLE reports (
    uniqueid varchar(255),
    active varchar(255),
    reporterid varchar(255),
    reportertag varchar(255),
    reportedid varchar(255),
    reportedtag varchar(255),
    reason text,
    links text,
    notes text
);

CREATE TABLE appeals (
    uniqueid varchar(255),
    active varchar(255),
    userid varchar(255),
    usertag varchar(255),
    banreason text,
    unbanreason text,
    sorry text,
    mistakes text,
    notes text
);

CREATE TABLE staff (
    usertag varchar(255),
    userid varchar(255),
    enforcerid varchar(255),
    enforcertag varchar(255)
);

CREATE TABLE loggingchannels (
    guildid varchar(255),
    channelid varchar(255),
    enforcerid varchar(255),
    type varchar(255)
);

CREATE TABLE sticky (
    guild varchar(255),
    channel varchar(255),
    message TEXT,
    embed varchar(255),
    color TEXT
);