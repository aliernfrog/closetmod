export default {
  id: "1429877147174043678",
  async execute(client, message) {
    if (message.author?.moderator || !message.member) return;
    
    const reason = "Softban triggered by message in mouse trap";
    
    await message.delete();
    
    await message.member.ban({
      deleteMessageSeconds: 120,
      reason: reason
    });
    
    await message.guild.bans.remove(message.author.id, reason);
  }
}