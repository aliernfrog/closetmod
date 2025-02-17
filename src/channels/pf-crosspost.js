import { AttachmentBuilder, MessageFlags } from "discord.js";

export default {
  id: "1003647447135965216",
  execute(client, message) {
    if (!message.flags.has(MessageFlags.IsCrosspost)) return;
    const channel = client.channels.cache.get("855250425794920448");
    message.forward(channel);
    /*message.content = `${message.content ?? ""}\n\n-# Forwarded from Polyfield server`;
    
    channel.send({
      allowedMentions: { parse: [] },
      content: message.content,
      embeds: message.embeds,
      files: message.attachments?.map(a => AttachmentBuilder.from(a))
    }).then(msg => msg.crosspost()).catch(() => {
      channel.send({
        allowedMentions: { parse: [] },
        content: message.content+message.attachments?.map(a => `\n${a.url}`),
        embeds: message.embeds
      }).then(msg => msg.crosspost());
    });*/
  }
}