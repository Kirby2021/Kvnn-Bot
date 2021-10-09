const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");
const customCommandModel = require("../models/customComands");
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {

        await client.guilds.cache
            .get("894612717434982420")
            .commands.set(arrayOfSlashCommands);

        // await client.application.commands.set(arrayOfSlashCommands);

        customCommandModel.find().then((data) => {
            data.forEach((cmd) => {
                const guild = client.guilds.cache.get(cmd.guildId);
                guild?.commands.create({
                    name: cmd.commandName,
                    description: 'Custom Commands Powered By https://www.kvnn.net/'
                })
            })
        })
    });

    const { mongooseConnectionString } = require('../config.json')
    if (!mongooseConnectionString) return;
    const mongoose = require('mongoose');
    mongoose.connect(mongooseConnectionString, {
        useUnifiedTopology : true,
        useNewUrlParser : true,
    }).then(console.log('connected to mongooseDB'))
};
