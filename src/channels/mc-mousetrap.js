export default {
  id: "1429926553919164496",
  async execute(client, message) {
    if (message.author?.moderator || !message.member) return;
    
    const reason = "Softban triggered by message in mouse trap";
    
    try {
      await message.delete();
    } catch {}
    
    try {
      await message.author.send([
        `### You were temporarily kicked from **${message.guild.name}**`,
        "You sent a message in a channel in which we clearly stated that sending a message will perform an instant ban.",
        "**If you do not remember doing this**, your account may have been compromised. Please secure your account immediately.",
        "",
        "-# You're welcome to rejoin: https://discord.gg/aQhGqHSc3W"
      ].join("\n"));
    } catch {}
    
    await message.member.ban({
      deleteMessageSeconds: 600,
      reason: reason
    });
    
    await message.guild.bans.remove(message.author.id, reason);
  }
}