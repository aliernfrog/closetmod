export default {
  name: "clientReady",
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} | ${client.guilds.cache.size} guilds`);
    process.on("uncaughtException", err => console.log(err));
  }
}