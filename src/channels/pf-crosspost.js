import { AttachmentBuilder, MessageFlags } from "discord.js";

export default {
  id: "1003647447135965216",
  async execute(client, message) {
    if (!message.flags.has(MessageFlags.IsCrosspost)) return;
    const forwarded = await message.forward("855250425794920448");
    await forwarded.crosspost();
  }
}