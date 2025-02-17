import { MessageFlags } from "discord.js";

const FORWARD_TO = "855250425794920448"; // closet news channel

export default {
  id: "1003647447135965216",
  execute(client, message) {
    if (!message.flags.has(MessageFlags.IsCrosspost)) return;
    
    message.forward(FORWARD_TO)
      .then(msg => msg.crosspost())
      .catch(async () => {
        const channel = await client.channels.fetch(FORWARD_TO);
        channel.send({
          content: [
            message.content?.length ? `${message.content}\n` : "",
            message.attachments?.size ? message.attachments?.map?.(a => a.url)?.join?.("\n")+"\n" : "",
            "\n-# Forwarded from Polyfield server"
          ].join(""),
          embeds: message.embeds,
          allowedMentions: { parse: [] }
        }).then(msg => msg.crosspost());
      });
  }
}