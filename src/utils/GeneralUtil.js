import { Collection, EmbedBuilder } from "discord.js";
import { readdirSync } from "fs";
import { guildData } from "../db/db.js";
import config from "../values/config.js";

const utils = {
  async readEvents(client) {
    const files = readdirSync("./src/events").filter(file => file.endsWith(".js"));
    for (const file of files) {
      const event = (await import(`../events/${file}`)).default;
      if (event.once) client.once(event.name, (...args) => event.execute(client, ...args));
      else client.on(event.name, (...args) => event.execute(client, ...args));
    }
    console.log(`Loaded ${files.length} events`);
  },

  async readCommands(client) {
    const temp = new Collection();
    const folders = readdirSync("./src/interactions/commands");
    for (const folder of folders) {
      const files = readdirSync(`./src/interactions/commands/${folder}`).filter(file => file.endsWith(".js"));
      for (const file of files) {
        const command = (await import(`../interactions/commands/${folder}/${file}`)).default;
        temp.set(command.data.name, command);
      }
    }
    if (client) client.commands = temp;
    console.log(`Loaded ${temp.size} commands`);
    return temp;
  },

  async readSubcommands(client) {
    const folders = readdirSync("./src/interactions/subcommands");
    for (const folder of folders) {
      const files = readdirSync(`./src/interactions/subcommands/${folder}`).filter(file => file.endsWith(".js"));
      for (const file of files) {
        const subcommand = (await import(`../interactions/subcommands/${folder}/${file}`)).default;
        client.subcommands.set(`${folder}/${subcommand.name}`, subcommand);
      }
    }
    console.log(`Loaded ${client.subcommands.size} subcommands`);
  },

  async readMessageComponents(client) {
    const folders = readdirSync("./src/interactions/messageComponents");
    for (const folder of folders) {
      const files = readdirSync(`./src/interactions/messageComponents/${folder}`).filter(file => file.endsWith(".js"));
      for (const file of files) {
        const component = (await import(`../interactions/messageComponents/${folder}/${file}`)).default;
        client.messageComponents.set(component.name, component);
      }
    }
    console.log(`Loaded ${client.messageComponents.size} message components`);
  },

  async readSpecialChannels(client) {
    const files = readdirSync("./src/channels").filter(file => file.endsWith(".js"));
    for (const file of files) {
      const channel = (await import(`../channels/${file}`)).default;
      client.specialChannels.set(channel.id, channel);
    }
    console.log(`Loaded ${client.specialChannels.size} special channels`);
  },

  async readSpecialForums(client) {
    const files = readdirSync("./src/forums").filter(file => file.endsWith(".js"));
    const toInit = [];
    for (const file of files) {
      const forum = (await import(`../forums/${file}`)).default;
      if (forum.init) toInit.push(forum.init);
      client.specialForums.set(forum.id, forum);
    }
    if (toInit.length) client.once("clientReady", async (cl) => {
      for (const execute of toInit) {
        try {
          await execute(cl);
        } catch (e) {
          console.error(e);
        }
      }
    });
    console.log(`Loaded ${client.specialForums.size} special forums`);
  },

  async readNavigatorChannels(client) {
    const files = readdirSync("./src/navigatorChannels").filter(file => file.endsWith(".js"));
    for (const file of files) {
      const channel = (await import(`../navigatorChannels/${file}`)).default;
      client.navigatorChannels.set(channel.id, channel);
    }
    console.log(`Loaded ${client.navigatorChannels.size} navigator channels`);
  },

  async inform(message, options, deleteAfter, instantDelete) {
    if (message.system) return message.delete();
    if (options.content) options.content = `${message.author}, ${options.content || ""}`;
    else options = `${message.author}, ${options || ""}`;
    const reply = await message.channel.send(options);
    if (instantDelete) message.delete();
    setTimeout(() => {
      if (!instantDelete) message.delete();
      reply.delete();
    }, deleteAfter || config.defaultInformTimeout);
  },

  async isInGuild(user, guild) {
    try {
      const member = await guild.members.fetch(user.id);
      if (member) return true;
      else return false;
    } catch {
      return false;
    }
  },

  hasMedia(message) {
    if (!message.attachments.size) return false;
    return true;
  },

  hasLink(message) {
    return message.content.includes("http://") || message.content.includes("https://") || message.content.includes("discord.gg");
  },

  getFileName(str) {
    const split = str.split(".");
    split.pop();
    return split.join(".");
  },

  buildMessageURL(message) {
    return `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
  },

  buildChannelURL(channel) {
    return `https://discord.com/channels/${channel.guild.id}/${channel.id}`;
  },

  async generateLeaderboard(client, guildId) {
    const data = await client.db.guildData(guildId);
    const maps = data.maps || [];
    const starred = [];
    const leaders = [];
    for (let i = 0; i < maps.length; i++) {
      try {
        const map = maps[i];
        const channel = await client.channels.fetch(map.channelId);
        const message = await channel.messages.fetch(map.messageId, {force: true});
        const upvotes = message.reactions.resolve("968963540117512252")?.count || 0;
        const downvotes = message.reactions.resolve("968963600611934259")?.count || 0;
        const stars = message.reactions.resolve("⭐")?.count || 0;
        map.totalVotes = upvotes-downvotes;
        map.link = `https://discord.com/channels/${guildId}/${map.channelId}/${map.messageId}`;
        if (stars > 0) starred.push(map);
        else if (map.totalVotes > 0) leaders.push(map);
      } catch { /*...*/ }
    }
    const embed = new EmbedBuilder().setTitle("🏆 Map leaderboard").setColor("Random");
    const fields = [];
    starred.sort((a,b) => b.totalVotes-a.totalVotes);
    leaders.sort((a,b) => b.totalVotes-a.totalVotes);
    starred.forEach(map => fields.push({name: `⭐ \`${map.mapName.replaceAll("`","")}\` - ${map.totalVotes} votes - by <@${map.authorId}>`, value: `[View map](${map.link})`}));
    leaders.slice(0,10).forEach(map => fields.push({name: `• \`${map.mapName.replaceAll("`","")}\` - ${map.totalVotes} votes - by <@${map.authorId}>`, value: `[View map](${map.link})`}));
    embed.addFields(fields);
    return embed;
  },
  
  generateFAQMessage(faq, guild) {
    const titles = faq.map(
      (q, i) => `### **${i+1}.** [${q.title}](https://discord.com/channels/${guild?.id}/${q.channelId}/${q.messageId})`
    );
    return [
      "## ❓ FAQ",
      "Click questions to see their answers.",
      "",
      titles.join("\n\n")
    ].join("\n");
  },
  
  generateQuestionMessage(question) {
    return [
      `## ❓ ${question.title}`,
      question.description
    ].join("\n");
  },
  
  async updateFAQMessage(guild) {
    const data = await guildData(guild.id);
    const faqData = data.faq;
    const faqChannel = await guild.channels.fetch(faqData.channelId);
    const faqMessage = await faqChannel.messages.fetch(faqData.messageId);
    return await faqMessage.edit({
      content: utils.generateFAQMessage(faqData.faq, guild)
    });
  }
}

export default utils;