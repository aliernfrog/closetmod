import { ContainerBuilder, MessageFlags, TextDisplayBuilder } from "discord.js";

export default {
  channelId: "1393176462617608214",
  build() {
    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent([
          "# <:hammer:1019657094175146095> Reporting cheaters",
          "-# This channel is only for reporting cheaters.",
          "",
          "**When reporting cheaters, make sure to include the following:**",
          "- Their in-game name",
          "- The server where the incident occured",
          "",
          "> **<:discordok:898603791157436447> Important**",
          "> We can only take action on reports from in-game servers tagged with the **[OFFICIAL]** tag.",
          "> You're welcome to report cheaters from community servers as well, but please note that we do not moderate those servers. In such cases, your report may only be seen if the server host monitors this channel."
        ].join("\n"))
      );
  
    return {
      components: [ container ],
      flags: [ MessageFlags.IsComponentsV2 ]
    }
  }
}