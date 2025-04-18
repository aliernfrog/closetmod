export default {
  name: "set-milestone-data",
  async execute(client, interaction) {
    const milestone = interaction.options.getString("milestone");
    const user = interaction.options.getUser("user");
    const additionalUsers = interaction.options.getString("additional-users");
    const data = await client.db.guildData(interaction.guild.id);

    if (!user && !additionalUsers) data.counting.milestones.delete(milestone);
    else {
      const milestoneData = data.counting.milestones.get(milestone) ?? {};
      if (user) milestoneData.userId = user.id;
      if (additionalUsers) milestoneData.additionalUsers = additionalUsers.split(",");
      data.counting.milestones.set(milestone, milestoneData);
    }

    await data.save();

    interaction.reply({
      content: "☑️ Set milestone data"
    });
  }
}