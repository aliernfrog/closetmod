import { ApplicationCommandType, PermissionFlagsBits } from "discord.js";

export default {
  data: {
    name: "Emit message",
    type: ApplicationCommandType.Message,
    dmPermission: false,
    defaultMemberPermissions: [PermissionFlagsBits.ManageMessages]
  },
  execute(client, interaction) {
    const message = interaction.options.getMessage("message");
    client.emit("messageCreate", message);
    interaction.reply({content: "Success!", ephemeral: true});
  }
}