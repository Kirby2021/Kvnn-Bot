const { Client, MessageEmbed, Message } = require("discord.js");
const { errorColor, sucsessColor } = require("../../embeds/embedColor.json");
const { sucsessEmoji, errorEmoji, astro } = require("../../embeds/embedEmojis.json");
const { footer } = require("../../embeds/embedText.json");
const jokee = require("discord-jokes");
module.exports = {
  name: "dadjoke",
  description: 'tells a dad joke',
  /**
   * @param {Client} client
   * @param {Message} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    jokee.getRandomDadJoke(function (joke) {

        let embed = new MessageEmbed().setFooter(footer)
        .setDescription(joke)
      interaction.reply({ embeds: [embed] });
    });
  },
};