const { MessageEmbed, PermissionFlagsBits } = require("discord.js");
const config = require("../../config.json");

module.exports = {
  async execute(client, message) {
    if (message.author.bot) return;
    const channel = client.specialChannels.get(message.channel.id);
    if (!channel) return;

    message.inform = (options, deleteAfter, instantDelete) => client.f.inform(message, options, deleteAfter, instantDelete);
    
    const authorInGuild = await client.f.isInGuild(message.author, message.guild);
    message.author.moderator = authorInGuild && message.channel.permissionsFor(message.author).has(PermissionFlagsBits.ManageMessages);

    if (channel.mediaOnly && !message.author.moderator && !client.f.hasMedia(message)) {
      const informOptions = {content: "This channel is media-only"};
      if (channel.suggestThreads) informOptions.embeds = [new MessageEmbed().setDescription("Use threads to start a discussion on a media")];
      return message.inform(informOptions);
    }
    if (channel.linksOnly && !message.author.moderator && !client.f.hasLink(message)) {
      const informOptions = {content: "This channel is links-only"};
      if (channel.suggestThreads) informOptions.embeds = [new MessageEmbed().setDescription("Use threads to start a discussion on a link")];
      return message.inform(informOptions);
    }
    if (channel.disableReplies && !message.author.moderator && message.type === "REPLY") {
      const informOptions = {content: "Replies are disabled in this channel"};
      if (channel.suggestThreads) informOptions.embeds = [new MessageEmbed().setDescription("Use threads to start a discussion")];
      return message.inform(informOptions);
    }
    
    if (channel.cooldown && channel.cooldown.duration && !message.author.moderator) {
      const data = await client.db.getUserCooldown(message.author.id, message.channel.id);
      const lastMsg = data.lastMsg || 0;
      const nextMsg = parseInt(lastMsg)+parseInt(channel.cooldown.duration);
      if (Date.now() < nextMsg) {
        const timestamp = `<t:${Math.floor(nextMsg/1000)}:F>`;
        const msg = (channel.cooldown.message || config.defaultCooldownMessage).replace("%TIME%", timestamp);    
        message.inform(msg, undefined, true);
      } else {
        await client.db.setUserCooldown(message.author.id, {
          channel: message.channel.id,
          lastMsg: Date.now()
        });
      }
    }
    
    if (channel.autoThread && !message.hasThread) message.startThread(channel.autoThread);
    if (channel.execute) channel.execute(client, message);
  }
}