//import { MessageFlags } from "discord.js";

export default {
  id: "1341103791306707015",
  async execute(client, message) {
    //if (!message.flags.has(MessageFlags.IsCrosspost)) return;
    const forwarded = await message.forward("860820160503742485");
    //await forwarded.crosspost();
  }
}