import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

export default {
  data: {
    name: "counting-moderation",
    description: "Moderates counting in current server.",
    options: [
      {
        name: "set-last-count",
        description: "Sets last count value of current server.",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "last-count",
            description: "Last count value to set.",
            required: true,
            type: ApplicationCommandOptionType.Integer
          },
          {
            name: "reset-last-user",
            description: "Whether to reset last user, defaults to true.",
            type: ApplicationCommandOptionType.Boolean
          }
        ]
      },
      {
        name: "set-milestone-data",
        description: "Sets data of a counting milestone.",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "milestone",
            description: "Milestone to set data of.",
            type: ApplicationCommandOptionType.String,
            required: true
          },
          {
            name: "user",
            description: "The user who reached the milestone, leave empty to reset.",
            type: ApplicationCommandOptionType.User
          },
          {
            name: "additional-users",
            description: "IDs of the additional users who reached the milestone splitted with a comma, leave empty to reset.",
            type: ApplicationCommandOptionType.String
          }
        ]
      },
      {
        name: "set-user-data",
        description: "Sets counting data of a user.",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "User to set data of.",
            type: ApplicationCommandOptionType.User,
            required: true
          },
          {
            name: "counts",
            description: "Count of user's successful counts.",
            type: ApplicationCommandOptionType.Integer,
            required: true
          }
        ]
      }
    ],
    dmPermission: false,
    defaultMemberPermissions: [PermissionFlagsBits.ManageMessages]
  }
}