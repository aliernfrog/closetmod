import "dotenv/config";

import { Client, Collection, GatewayIntentBits } from "discord.js";
import { start as startServer } from "./src/utils/ServerUtil.js";
import config from "./src/values/config.js";
import guildConfig from "./src/values/guildConfig.js";
import functions from "./src/utils/GeneralUtil.js";
import * as AIUtil from "./src/utils/AIUtil.js";
import * as ModLogUtil from "./src/utils/ModLogUtil.js";
import * as db from "./src/db/db.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.rest.on("rateLimited", (data) => {
  if (data.timeout > 10000) process.kill(1);
});

client.commands = new Collection();
client.subcommands = new Collection();
client.messageComponents = new Collection();
client.specialChannels = new Collection();
client.specialForums = new Collection();
client.navigatorChannels = new Collection();

client.config = config;
client.guildConfig = guildConfig;
client.f = functions;
client.ModLogUtil = ModLogUtil;
client.AIUtil = AIUtil;
client.db = db;

(async () => {
  await client.f.readEvents(client);
  await client.f.readCommands(client);
  await client.f.readSubcommands(client);
  await client.f.readMessageComponents(client);
  await client.f.readSpecialChannels(client);
  await client.f.readSpecialForums(client);
  await client.f.readNavigatorChannels(client);
})();

startServer(client);
client.db.connect();
client.login(config.token);