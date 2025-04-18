import { EmbedBuilder } from "discord.js";

export default {
  name: "milestones",
  async execute(client, interaction) {
    const data = await client.db.guildData(interaction.guild.id);
    const milestones = data.counting?.milestones ?? new Map();
    const embedData = [];

    milestones.forEach((value, key) => {
      const messageLink = `https://discord.com/channels/${interaction.guild.id}/${value.channelId}/${value.messageId}`;
      const mentions = [ value.userId ].concat(value.additionalUsers ?? []).map(id => `<@${id}>`);
      embedData.push(`**• [${key}](${messageLink})** - ${mentions.join(" & ")}`);
    });
    if (!milestones.size) embedData.push("No milestones reached.");

    const embed = new EmbedBuilder()
      .setTitle("🏆 Milestones")
      .setThumbnail(interaction.guild.iconURL())
      .setColor("Blue")
      .setDescription(embedData.join("\n"));
    if (milestones.size) embed.setFooter({text: `${milestones.size} milestones reached`});

    interaction.reply({
      embeds: [embed]
    });
  }
}